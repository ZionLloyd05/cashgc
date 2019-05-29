import { DatabaseProvider } from "./../database/index";
import { IUserDTO } from "./../models/User";
import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { Admin } from "../models/Admin";

@injectable()
export class AuthService {
	public mustBeLoggedIn(req: Request, res: Response, next: NextFunction) {
		// console.log(req.originalUrl);
		// console.log(req.baseUrl);
		// console.log("user from authservice");
		// console.log(req.user);
		let user = req.user;
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect("/signin");
		}
	}

	public async routeGaurd(req: Request, res: Response, next: NextFunction) {
		if (!req.user) return next();
		let user = req.user;

		const db = await DatabaseProvider.getConnection();

		let adminRepository = await db.getRepository(Admin);
		let admin = await adminRepository.findOne({ user: user });
		let url = req.originalUrl;
		let urlStringArr = url.split("/");
		let entity = urlStringArr[1];
		// console.log("here" + Object.keys(admin).length + " " + entity);
		if (admin && admin != null && entity == "user") {
			res.redirect("/admin");
			console.log("an admin");
		} else if ((admin == undefined || admin == null) && entity == "admin") {
			console.log("thief");
			res.redirect("/logout");
		} else {
			console.log("none");
			next();
		}
		// if (admin && admin != null) {
		//   conso
		// }
		// else {

		// }
	}

	/**
	 * confirmAdmin
	 */
	// public async confirmAdmin(user: IUserDTO): Promise<boolean> {
	// 	const db = await DatabaseProvider.getConnection();

	// 	let adminRepository = await db.getRepository(Admin);
	// 	let admin = await adminRepository.findOne({ user: user });
	// 	console.log(admin);
	// 	if (admin && admin != null) return true;
	// 	else return false;
	// }
}
