import { UserController } from "./../controllers/user.ctrl";
import { GccController } from "./../controllers/gcc.ctrl";
import { AuthService } from "./../services/auth.service";
import { Router, Request, Response, NextFunction } from "express";
import { IRoute } from "./IRoute";
import DIContainer from "../container/DIContainer";

import * as csurf from "csurf";
import { create } from "domain";

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

		/**
		 * Invoice route
		 */
		router.get("/user/invoice", this.serveInvoiceView.bind(this));

		/**
		 * GiftCode routes
		 */
		router.post("/user/giftcode", this.scaffoldcodes.bind(this));
		router.get("/user/mycodes", this.serveCodeView.bind(this));
		/**
		 * Transaction routes
		 */
		router.post("/user/transaction", this.postTransaction.bind(this));
		router.get("/user/transaction", this.getTransactions.bind(this));
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

	private serveCodeView(req: Request, res: Response) {
		res.render("user/codes", {
			title: "My Codes",
			layout: "userLayout",
			isCode: true,
			csrfToken: req.csrfToken()
		});
	}

	private serveInvoiceView(req: Request, res: Response) {
		res.render("user/invoice", {
			title: "Invoice",
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

	private async scaffoldcodes(req: Request, res: Response) {
		let codeItems = req.body;
		let codes = await this._userController.scaffoldCodes(codeItems);
		res.send({
			status: "created",
			data: codes
		});
	}

	private async postTransaction(req: Request, res: Response) {
		let payload = req.body;
		payload.user = req.user;
		let transaction = await this._userController.createTransaction(payload);
		res.send({
			status: "created",
			data: transaction
		});
	}

	private async getTransactions(req: Request, res: Response) {
		let userid = req.user.id;
		let transactions = await this._userController.getUserTransaction(userid);
		res.send({
			status: "read",
			data: transactions
		});
	}
}
