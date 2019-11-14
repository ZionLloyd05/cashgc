import { SharedService } from './shared.service';
import { UserService } from "./user.service";
import { DatabaseProvider } from "./../database/index";
import { User } from "../models/User";
import * as crypto from "crypto";
import { Mail } from "../handlers/mail";
import { MoreThan } from "typeorm";
import DIContainer from "../container/DIContainer";
import { injectable } from "inversify";

@injectable()
export class AccountService {
	private _userService: UserService = DIContainer.resolve<UserService>(
		UserService
	);

	private _sharedService: SharedService = DIContainer.resolve<SharedService>(
		SharedService
	);

	public async forgotPassword(email: string, header: string): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		// 1. check if email exist
		let user = await this._userService.getByEmail(email);

		// console.log(user);

		let error = "";

		if (!user) {
			// console.log("false");
			error = "Account does not exist";
			return error;
		}

		// console.log("true");

		//2. set reset token and expiry
		user.utoken = this._sharedService.generateToken(25);
		var now = new Date();
		now.setMinutes(now.getMinutes() + 15); // timestamp
		now = new Date(now); // Date object
		user.uTokenExpiryDate = now; // 5 minutes from now

		await db.getRepository(User).save(user);

		// console.log(user);

		// 3. send token to email
		const url = `${header}/account/reset/${user.utoken}`;
		const htmlContent = `<h3>Hello Dear User,</h3><br/><p>Kindly click <a href="${url}"><b>here</b></a>, or copy and paste the link in your browser to reset your password,</p><br/>${url}<br/><p>From Cash GiftCode</p>`;
		const textContent = `Hi dear user, click on the link attached to reset your password. ${url} , From Cash GiftCode`;

		let payload = {
			user,
			subject: "Password Reset",
			htmlContent,
			textContent
		};

		// console.log(payload);

		await this.sendEmail(payload)
		.catch(err => {
			console.log(err);
			return false;
		})

		return true;
	}

	public async sendVerificationCode(email: string, header: string) {
		const db = await DatabaseProvider.getConnection();
		// 1. check if email exist
		let user = await this._userService.getByEmail(email);

		// console.log(user);

		let error = "";

		if (!user) {
			// console.log("false");
			error = "Account does not exist";
			console.log(error);
			return false;
		}

		user.utoken = "CG_" + this._sharedService.generateToken(7);

		var now = new Date();
		now.setMinutes(now.getMinutes() + 15); // timestamp
		now = new Date(now); // Date object
		user.uTokenExpiryDate = now; // 5 minutes from now

		await db.getRepository(User).save(user);

		await db.getRepository(User).save(user);

		// console.log(user);

		// 3. send token to email
		const token = user.utoken;
		const htmlContent = `<h3>Hi dear user,</h3><br/><p>Here's your token : ${token}</p>`;
		const textContent = `Hi dear user, Here's your token ${token} , From Cash GiftCode`;

		let payload = {
			user,
			subject: "Email Verification Token",
			htmlContent,
			textContent
		};

		await this.sendEmail(payload);

		return true;
	}

	public async verifyAccount(token: string): Promise<any> {

		const db = await DatabaseProvider.getConnection();

		let user = await this.isTokenValid(token);

		if (user == null) return false;

		user.isVerified = true;
		user.utoken = "";
		user.uTokenExpiryDate = "";

		let userUpdated = await db.getRepository(User).save(user);

		if (Object.keys(userUpdated).length > 1) return true;
		else return false;
	}

	public async isTokenValid(token: string): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		var now = new Date();
		now.setMinutes(now.getMinutes() + 1);
		now = new Date(now);

		let user = await db
			.getRepository(User)
			.createQueryBuilder("user")
			.where({ utoken: token })
			.getOne();

		if (user != null) {
			let resetExpireTimeOut = user.uTokenExpiryDate;
			if (resetExpireTimeOut > now) return user;
		}

		return null;
	}

	public async checkTokenValidity(token: string): Promise<any> {
		let user = await this.isTokenValid(token);

		if (user == null) return false;

		return true;
	}

	public async updatePassword(
		token: string,
		newPassword: string
	): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		let user = await this.isTokenValid(token);

		if (user == null) return false;

		user.password = this._userService.hashPassword(newPassword);
		user.resetPasswordExpiryDate = "";
		user.resetPasswordToken = "";

		let userUpdated = await db.getRepository(User).save(user);

		if (Object.keys(userUpdated).length > 1) return true;
		else return false;
	}
	
	/**
	 * sendEmail
	 */
	public async sendEmail(payload) {
		const mail = new Mail();

		await mail.send(payload);
	}
}
