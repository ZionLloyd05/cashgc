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

		/**
		 * Cart Item routes
		 */
		router.get("/user/cartitem", this.cartItemOperation.bind(this));
		router.post("/user/cartitem", this.addItemToCart.bind(this));
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
		let itemBundle = await this._userController.getCartItems(req.user);
		// console.log(itemBundle);
		res.send({
			status: "read",
			data: itemBundle
		});
	}

	private async addItemToCart(req: Request, res: Response) {
		const { gcId, qty } = req.body;
		let saved = await this._userController.addToCart(gcId, req.user.id, qty);
		res.send({
			status: "added",
			data: saved
		});
	}
}
