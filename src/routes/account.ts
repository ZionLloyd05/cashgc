import { UserController } from "./../controllers/user.ctrl";
import { Router, Request, Response } from "express";
import { IRoute } from "./IRoute";
import csurf = require("csurf");
import DIContainer from "../container/DIContainer";

export class AccountRoute implements IRoute {
	private _userController: UserController = DIContainer.resolve<UserController>(
		UserController
	);

	initialize(router: Router): void {
		const csrfProtection = csurf();
		router.use(csrfProtection);

		router.get("/account/reset/:token", this.serveResetView.bind(this));
		router.post("/account/reset/:token", this.updatePassword.bind(this));
	}

	private async serveResetView(req: Request, res: Response) {
		let token = req.params.token;

		let response = await this._userController.confirmTokenValidity(token);

		if (!response) {
			console.log("false");
			let msg = "Password reset is invalid or has expired";
			return res.redirect(`/reset-password/${msg}`);
		} else {
			console.log("true");
			res.render("reset", {
				title: "Reset Password",
				layout: "authLayout",
				csrfToken: req.csrfToken()
			});
		}
	}

	private async updatePassword(req: Request, res: Response) {
		let token = req.params.token;
		let newPassword = req.body.password;

		let response = await this._userController.updateResetPassword(
			token,
			newPassword
		);
		if (response == true) {
			res.redirect("/signin");
		}
	}
}
