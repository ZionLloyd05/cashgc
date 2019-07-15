import { UserController } from "./../controllers/user.ctrl";
import { GccController } from "./../controllers/gcc.ctrl";
import { AuthService } from "./../services/auth.service";
import { Router, Request, Response, NextFunction } from "express";
import { IRoute } from "./IRoute";
import * as paypal from "paypal-rest-sdk";
import DIContainer from "../container/DIContainer";

import * as csurf from "csurf";
import { PaystackService } from "../services/paystack.service";

export class UserRoute implements IRoute {
	private itemTotalAmount: Number = 0;
	private _authService: AuthService = DIContainer.resolve<AuthService>(
		AuthService
	);
	private _gcController: GccController = DIContainer.resolve<GccController>(
		GccController
	);
	private _userController: UserController = DIContainer.resolve<UserController>(
		UserController
	);

	private _paystackService: PaystackService = DIContainer.resolve<
		PaystackService
	>(PaystackService);

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
		router.get("/user/transaction", this.transactOperation.bind(this));
		router.post("/user/pay", this.handlePayment.bind(this));

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

		/**
		 * Payments Route
		 */
		router.get("/user/payment-success", this.executePayment.bind(this));
		router.get("/user/payment-cancel", this.cancelPayment.bind(this));
		// router.get("/user/successpage", this.serveSuccessView.bind(this));

		/**
		 * Miscellenous Route
		 */
		router.get("/user/banks", this.fetchBanks.bind(this));
		router.get("/user/bankcode", this.fetchBankCode.bind(this));
		router.get("/user/resolve-account", this.resolveAccount.bind(this));
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

	// private serveSuccessView(req: Request, res: Response) {
	// 	res.render("user/success", {
	// 		title: "Invoice",
	// 		layout: "userLayout",
	// 		isStore: true,
	// 		csrfToken: req.csrfToken()
	// 	});
	// }

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

	private async transactOperation(req: Request, res: Response) {
		let userid = req.user.id;
		if (req.query && req.query.tid) {
			let tid = req.query.tid;
			let transaction = await this._userController.getUserCodesByTransaction(
				userid,
				tid
			);
			res.send({
				status: "read",
				data: transaction
			});
		} else {
			let transactions = await this._userController.getUserTransactions(userid);
			res.send({
				status: "read",
				data: transactions
			});
		}
	}

	private async serveTransactionView(req: Request, res: Response) {
		res.render("user/transaction", {
			title: "Transactions",
			layout: "userLayout",
			csrfToken: req.csrfToken(),
			isTransaction: true
		});
	}

	private async handlePayment(req: Request, res: Response) {
		var { items, totalAmount } = req.body;

		this.itemTotalAmount = totalAmount;

		var create_payment_json = {
			intent: "sale",
			payer: {
				payment_method: "paypal"
			},
			redirect_urls: {
				return_url: "http://localhost:3000/user/payment-success",
				cancel_url: "http://localhost:3000/user/payment-cancel"
			},
			transactions: [
				{
					item_list: {
						items: items
					},
					amount: {
						currency: "USD",
						total: totalAmount
					},
					description: "This is the payment description."
				}
			]
		};

		paypal.payment.create(create_payment_json, function(error, payment) {
			if (error) {
				console.log(error.response.details);
				res.send(error);
			} else {
				for (let i = 0; i < payment.links.length; i++) {
					if (payment.links[i].rel === "approval_url") {
						res.send({
							status: "create",
							data: payment.links[i].href
						});
					}
				}
			}
		});
	}

	private async executePayment(req: Request, res: Response) {
		const payerId = req.query.PayerID;
		const paymentId = req.query.paymentId;

		const execute_payment_json = {
			payer_id: payerId,
			transactions: [
				{
					amount: {
						currency: "USD",
						total: this.itemTotalAmount
					}
				}
			]
		};

		paypal.payment.execute(
			paymentId,
			execute_payment_json,
			async (error, payment) => {
				if (error) {
					//	@TODO
					// Save transaction and set status to failed
					console.log(error.response);
					res.render("user/payment-confirmation", {
						title: "Payment",
						layout: "userLayout",
						isStore: true,
						isPaymentSuccessful: false
					});
				} else {
					console.log("Get Payment Response");
					console.log(JSON.stringify(payment));

					//get current user cart item
					const itemBundle = await this._userController.getCartItems(req.user);
					console.log(itemBundle);
					const userCartItems = itemBundle.items;

					// scaffold codes
					const codes = await this._userController.scaffoldCodes(userCartItems);
					let gcodes = codes;
					// //save transaction(gcodes)
					let transactionPayload = {
						status: 0,
						type: 0,
						payment: 0,
						gcodes,
						paymentRef: paymentId,
						user: req.user
					};

					let transaction = await this._userController.createTransaction(
						transactionPayload
					);

					// clear cart items
					const userId = req.user.id;
					await this._userController.clearCart(userId);

					//pass the transaction id and payment id to payment success page
					res.render("user/payment-confirmation", {
						title: "Payment",
						layout: "userLayout",
						isStore: true,
						isPaymentSuccessful: true,
						transactId: transaction.id,
						paymentId: transaction.paymentRef,
						csrfToken: req.csrfToken()
					});
				}
			}
		);
	}

	private cancelPayment(req: Request, res: Response) {
		res.render("user/payment-confirmation", {
			title: "Payment",
			layout: "userLayout",
			isStore: true,
			isPaymentSuccessful: false
		});
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
		let account = { ...req.body };

		account.user = req.user.id;

		let newBankacc = await this._userController.saveAccount(account);

		return res.send({
			status: "save",
			data: newBankacc
		});
	}

	private async getAccount(req: Request, res: Response) {
		const uacc = await this._userController.getAccount(req.user.id);

		return res.send({
			status: "read",
			data: uacc
		});
	}

	private async saveWallet(req: Request, res: Response) {
		let wallet = { ...req.body };

		wallet.user = req.user.id;

		let newWallet = await this._userController.saveWallet(wallet);

		return res.send({
			status: "save",
			data: newWallet
		});
	}

	private async getWallet(req: Request, res: Response) {
		const uwallet = await this._userController.getWallet(req.user.id);

		return res.send({
			status: "read",
			data: uwallet
		});
	}

	private async fetchBanks(req: Request, res: Response) {
		const banks = await this._paystackService.fetchBanks();
		return res.send({
			status: "read",
			data: banks
		});
	}

	private async fetchBankCode(req: Request, res: Response) {
		let bankname = req.query.bkname;
		const code = await this._paystackService.fetchBankCode(bankname);

		return res.send({
			status: "read",
			data: code
		});
	}

	private async resolveAccount(req: Request, res: Response) {
		let accnumber = req.query.accnumber;
		let bankcode = req.query.code;

		const response = await this._paystackService.resolveAccount(accnumber, bankcode);
		
		return res.send({
			status: "read",
			data: response
		})
	}

	/**
	 * Workers' Functions
	 */
}
