import { UserController } from "./../controllers/user.ctrl";
import { UserService } from "./../services/user.service";
import { GccController } from "./../controllers/gcc.ctrl";
import { AuthService } from "./../services/auth.service";
import { Router, Request, Response, NextFunction } from "express";
import { IRoute } from "./IRoute";
import DIContainer from "../container/DIContainer";

import * as csurf from "csurf";

export class UserRoute implements IRoute {
	private _authService: AuthService = DIContainer.resolve<AuthService>(
		AuthService
	);
	private _gcController: GccController = DIContainer.resolve<GccController>(
		GccController
	);
	private _userController: UserController = DIContainer.resolve<UserController>(
		UserController
	);

	initialize(router: Router): void {
		const csrfProtection = csurf();
		router.use(csrfProtection);

		router.all("/user/*", this._authService.mustBeLoggedIn);
		router.all("/user/*", this._authService.routeGaurd);

		router.get(
			"/user",
			this._authService.mustBeLoggedIn,
			this._authService.routeGaurd,
			this.serveDashboardView.bind(this)
		);

		router.get("/user/store", this.serveStoreView.bind(this));

		router.get("/user/cart", this.serveCartView.bind(this));

		/**
		 * Gift Category routes
		 */
		router.get("/user/category", this.getActiveCategories.bind(this));

		router.get("/user/cartitem/:operation", this.cartItemOperation.bind(this));
	}

	private serveDashboardView(req: Request, res: Response) {
		res.render("user/index", {
			title: "Dashboard",
			layout: "userLayout",
			isDashboard: true,
			csrfToken: req.csrfToken()
		});
	}

	private serveStoreView(req: Request, res: Response) {
		res.render("user/store", {
			title: "Dashboard",
			layout: "userLayout",
			isStore: true,
			csrfToken: req.csrfToken()
		});
	}

	private serveCartView(req: Request, res: Response) {
		res.render("user/cart", {
			title: "Cart",
			layout: "userLayout",
			isStore: true,
			csrfToken: req.csrfToken()
		});
	}

	private async getActiveCategories(req: Request, res: Response) {
		const activeGccs = await this._gcController.getActiveGccs();
		return res.send({
			status: "read",
			data: activeGccs
		});
	}

	private async cartItemOperation(req: Request, res: Response) {
		let operation = req.params.operation;
		let items = await this._userController.getCartItems(req.user);
		console.log(items);
		if (operation == "count") {
			let itemCount = items.length;
			res.send({
				status: "read",
				data: itemCount
			});
		}
	}
}
