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

	initialize(router: Router): void {
		const csrfProtection = csurf();
		router.use(csrfProtection);

		router.all("/user/*", this._authService.mustBeLoggedIn);

		router.get("/user", this.serveDashboardView.bind(this));

		router.get("/user/store", this.serveStoreView.bind(this));

		router.get("/user/cart", this.serveCartView.bind(this));

		/**
		 * Gift Category routes
		 */
		router.get("/user/category", this.getActiveCategories.bind(this));
	}

	private serveDashboardView(req: Request, res: Response) {
		res.render("user/index", {
			title: "Dashboard",
			layout: "userLayout",
			isDashboard: true
		});
	}

	private serveStoreView(req: Request, res: Response) {
		res.render("user/store", {
			title: "Dashboard",
			layout: "userLayout",
			isStore: true
		});
	}

	private serveCartView(req: Request, res: Response) {
		res.render("user/cart", {
			title: "Cart",
			layout: "userLayout",
			isStore: true
		});
	}

	private async getActiveCategories(req: Request, res: Response) {
		const activeGccs = await this._gcController.getActiveGccs();
		return res.send({
			status: "read",
			data: activeGccs
		});
	}
}
