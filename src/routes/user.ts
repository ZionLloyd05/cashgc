import { UserController } from "./../controllers/user.ctrl";
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
		router.get("/user/profile", this.serveProfileView.bind(this));
		router.post("/user/account", this.saveProfile.bind(this));

		/**
		 * Gift Category routes
		 */
		router.get("/user/category", this.getActiveCategories.bind(this));

		/**
		 * Cart Item routes
		 */
		router.get("/user/cartitem", this.cartItemOperation.bind(this));
		router.post("/user/cartitem", this.addItemToCart.bind(this));
		router.delete("/user/cartitem", this.clearCart.bind(this));
		router.get("/user/cartitem/:id", this.removeFromCart.bind(this));

		/**
		 * Invoice route
		 */
		router.get("/user/invoice", this.serveInvoiceView.bind(this));

		/**
		 * GiftCode routes
		 */
		router.post("/user/giftcode", this.scaffoldcodes.bind(this));
		router.get("/user/my-codes", this.serveCodeView.bind(this));
		router.get("/user/sales", this.serveSalesView.bind(this));
		router.get("/user/verify/:code", this.verifyCode.bind(this));

		/**
		 * Transaction routes
		 */
		router.get("/user/transactions", this.serveTransactionView.bind(this));
		router.post("/user/transaction", this.postTransaction.bind(this));
		router.get("/user/transaction", this.getTransactions.bind(this));
		router.post("user/paypal-transaction-complete", this.handleTransactionComplete.bind(this));

		/**
		 * Bank Account Route
		 */
		router.get("/user/bkaccount", this.getAccount.bind(this));
		router.post("/user/bkaccount", this.saveAccount.bind(this));

		/**
		 * Bitcoin Wallet Route
		 */
		router.get("/user/wallet", this.getWallet.bind(this));
		router.post("/user/wallet", this.saveWallet.bind(this));
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

	private serveSalesView(req: Request, res: Response) {
		res.render("user/sales", {
			title: "Sales",
			layout: "userLayout",
			isSales: true,
			csrfToken: req.csrfToken()
		});
	}

	private serveProfileView(req: Request, res: Response) {
		res.render("user/profile", {
			title: "Profile",
			layout: "userLayout",
			isProfile: true,
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

	private async clearCart(req: Request, res: Response) {
		const userId = req.user.id;
		await this._userController.clearCart(userId);
		res.send({
			status: "removed",
			data: true
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

	private async serveTransactionView(req: Request, res: Response) {
		res.render("user/transaction", {
			title: "Transactions",
			layout: "userLayout",
			csrfToken: req.csrfToken(),
			isTransaction: true
		});
	}

	private async handleTransactionComplete(req: Request, res: Response) {
		let {orderID, amountToPay} = req.body;
		// let response = await this._userController.verifyTransaction(orderId, amountToPay);
		res.send({
			status: "verify",
			// data: response
		})
	}

	private async verifyCode(req: Request, res: Response) {
		let code = req.params.code;
		let gcInDb = await this._userController.getGCbyCode(code);
		// console.log(gcInDb)
		if (gcInDb === undefined) {
			return res.send({
				status: "invalid"
			});
		} else if (gcInDb && gcInDb.isUsed == true) {
			return res.send({
				status: "used"
			});
		}
		return res.send({
			status: "valid",
			data: gcInDb
		});
	}

	private async removeFromCart(req: Request, res: Response) {
		let gccId = req.params.id;
		let userId = req.user.id;
		let result = await this._userController.removeFromCart(gccId, userId);
		return res.send({
			status: result
		});
	}

	private async saveProfile(req: Request, res: Response) {
		let { fname, lname, email, phone, country, id } = req.body;

		let userPayload = {
			firstname: fname,
			lastname: lname,
			email: email,
			phone: phone,
			country: country,
			id: id
		};

		let updatedUser = await this._userController.saveUser(userPayload);

		return res.send({
			status: "update",
			data: updatedUser
		});
	}

	private async saveAccount(req: Request, res: Response) {

		let account = { ...req.body }

		account.user = req.user.id;

		let newBankacc = await this._userController.saveAccount(account)

		return res.send({
			status: "save",
			data: newBankacc
		})
	}

	private async getAccount(req: Request, res: Response) {
		const uacc = await this._userController.getAccount(req.user.id);

		return res.send({
			status: "read",
			data: uacc
		})
	}

	private async saveWallet(req: Request, res: Response) {

		let wallet = { ...req.body }

		wallet.user = req.user.id;

		let newWallet = await this._userController.saveWallet(wallet)

		return res.send({
			status: "save",
			data: newWallet
		})
	}

	private async getWallet(req: Request, res: Response) {
		const uwallet = await this._userController.getWallet(req.user.id);

		return res.send({
			status: "read",
			data: uwallet
		})
	}
}
