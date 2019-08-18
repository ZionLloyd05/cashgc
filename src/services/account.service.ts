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

	public async forgotPassword(email: string, header: string): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		// 1. check if email exist
		let user = await db.getRepository(User).findOne({
			where: { email: email }
		});

		console.log(user);

		let error = "";

		if (!user) {
			console.log("false");
			error = "Account does not exist";
			return error;
		}

		console.log("true");

		//2. set reset token and expiry
		user.resetPasswordToken = crypto.randomBytes(25).toString("hex");
		user.resetPasswordExpiryDate = Date.now() + 900000; // 15 minutes from now

		await db.getRepository(User).save(user);

		console.log(user);

		// 3. send token to email
		const url = `${header}/account/reset-password/${user.resetPasswordToken}`;
		const htmlContent = `<h3>Hello dear user,</h3><br/><p>Kindly click <a href="${url}"><b>here</b></a>, or copy and paste the link in your browser to reset your password,</p><br/>${url}<br/><p>From Cash GiftCode</p>`;
		const textContent = `Hi dear user, click on the link attached to reset your password. ${url} , From Cash GiftCode`;

		let payload = {
			user,
			subject: "Password Reset",
			htmlContent,
			textContent
		};

		console.log(payload);

		await this.sendPwdEmail(payload);

		return true;
	}

	public async resetPasswordValidity(token: string): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		let user = await db
			.getRepository("user")
			.createQueryBuilder("user")
			.where({ resetPasswordExpires: MoreThan(Date.now()) })
			.where({ resetPasswordToken: token })
			.getOne();

		if (!user) {
			console.log("invalid");
			return null;
		}

		console.log("valid");
		return user;
	}

	public async checkTokenValidity(token: string): Promise<any> {
		let user = await this.resetPasswordValidity(token);

		if (user == null) return false;

		return true;
	}

	public async updatePassword(
		token: string,
		newPassword: string
	): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		// let user = await db
		// 	.getRepository(User)
		// 	.createQueryBuilder("user")
		// 	.where({ resetPasswordExpires: MoreThan(Date.now()) })
		// 	.where({ resetPasswordToken: token })
		// 	.getOne();

		// if (!user) return false;
		let user = await this.resetPasswordValidity(token);

		if (user == null) return false;

		user.password = this._userService.hashPassword(newPassword);
		user.resetPasswordExpiryDate = undefined;
		user.resetPasswordToken = undefined;

		let userUpdated = await db.getRepository(User).save(user);

		if (Object.keys(userUpdated).length > 1) return true;
		else return false;
	}

	/**
	 * sendPwdEmail
	 */
	public async sendPwdEmail(payload) {
		const mail = new Mail();

		await mail.send(payload);
	}
}
