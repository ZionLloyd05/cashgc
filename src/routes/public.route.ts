import { UserController } from "./../controllers/user.ctrl";
import { Router, Request, Response, NextFunction } from "express";
import { IRoute } from "./IRoute";
import * as passport from "passport";

import * as csurf from "csurf";
import DIContainer from "../container/DIContainer";

export class PublicRoute implements IRoute {
	private _userController: UserController = DIContainer.resolve<UserController>(
		UserController
	);

	initialize(router: Router): void {
		const csrfProtection = csurf();
		// router.use(csrfProtection);

		router.get("/", this.serveHomeView.bind(this));
		router.get("/signup", this.serveSignupView.bind(this));
		router.get("/signin", this.serveSignInView.bind(this));
		router.get("/privacy", this.servePrivacyView.bind(this));
		router.get("/reset-password", this.serveForgotPasswordView.bind(this));
		router.get("/reset-password/:msg", this.serveForgotPasswordView.bind(this));
		router.post("/reset-password", this.forgotPassword.bind(this));
		router.get("/logout", this.logout.bind(this));

		router.post(
			"/signin",
			passport.authenticate("local-signin", {
				successRedirect: "/user/store",
				failureRedirect: "/signin",
				failureFlash: true
			})
		);

		router.post(
			"/signup",
			passport.authenticate("local-signup", {
				successRedirect: "/",
				failureRedirect: "/signin",
				failureFlash: true
			})
		);
	}

	private async forgotPassword(req: Request, res: Response) {
		let email = req.body.email;
		let header = req.headers.host;
		let response = await this._userController.forgotPassword(email, header);

		if (response === true) {
			res.render("forgot", {
				title: "Reset Password",
				layout: "authLayout",
				hasMessage: true,
				message: "Reset link has been sent to your email."
			});
		} else if (response === false) {
			res.render("forgot", {
				title: "Reset Password",
				layout: "authLayout",
				hasMessage: true,
				message: "Account does not exist."
			});
		} else {
			res.render("forgot", {
				title: "Reset Password",
				layout: "authLayout",
				hasMessage: true,
				message: response
			});
		}
	}

	private serveForgotPasswordView(req: Request, res: Response) {
		let msg = req.params.msg;

		if (msg != null) {
			return res.render("forgot", {
				title: "Reset Password",
				layout: "authLayout",
				hasMessage: true,
				message: msg
			});
		} else {
			return res.render("forgot", {
				title: "Reset Password",
				layout: "authLayout"
			});
		}
	}

	private serveHomeView(req: Request, res: Response) {
		res.render("index", {
			title: "Home"
			// csrfToken: req.csrfToken()
		});
	}

	private serveSignupView(req: Request, res: Response) {
		res.render("signup", {
			title: "Sign Up",
			layout: "authLayout"
			// csrfToken: req.csrfToken()
		});
	}

	private servePrivacyView(req: Request, res: Response) {
		res.render("privacy", {
			title: "Privacy",
			layout: "layout"
		});
	}

	private serveSignInView(req: Request, res: Response) {
		var message = req.flash("error");
		res.render("signin", {
			title: "Sign In",
			layout: "authLayout",
			message,
			hasError: message != ""
			// csrfToken: req.csrfToken()
		});
	}

	private logout(req: Request, res: Response) {
		req.logout();
		res.redirect("/");
	}
}
