import { PaystackService } from "./../services/paystack.service";
import { UserService } from "./../services/user.service";
import { User } from "./../models/User";
import { GiftCodeCategory } from "./../models/GiftCodeCategory";
import { GccController } from "./../controllers/gcc.ctrl";
import { AuthService } from "./../services/auth.service";
import { Router, Request, Response } from "express";
import { IRoute } from "./IRoute";
import * as csurf from "csurf";
import DIContainer from "../container/DIContainer";
import * as multer from "multer";
import { UserController } from "./../controllers/user.ctrl";

export class AdminRoute implements IRoute {
	private _authService: AuthService = DIContainer.resolve<AuthService>(
		AuthService
	);
	private _gcController: GccController = DIContainer.resolve<GccController>(
		GccController
	);
	private _userController: UserController = DIContainer.resolve<UserController>(
		UserController
	);
	private _userService: UserService = DIContainer.resolve<UserService>(
		UserService
	);

	private _paystackService: PaystackService = DIContainer.resolve<
		PaystackService
	>(PaystackService);

	private upload: any;
	private storage: any;
	/**
	 *
	 */
	constructor() {
		this.storage = multer.diskStorage({
			filename: function(req, file, callback) {
				// accept image files only
				callback(null, Date.now() + file.originalname);
			}
		});
		this.upload = multer({
			storage: this.storage,
			fileFilter(req, file, next) {
				const isPhoto = file.mimetype.startsWith("image/");
				if (isPhoto) {
					next(null, true);
				} else {
					next(new Error("File not supported"), false);
				}
			}
		});
	}
	initialize(router: Router): void {
		const csrfProtection = csurf();
		router.use(csrfProtection);

		router.all("/admin/*", this._authService.mustBeLoggedIn);

		router.all("/admin/*", this._authService.routeGaurd);

		router.get(
			"/admin",
			this._authService.mustBeLoggedIn,
			this._authService.routeGaurd,
			this.serveDashboardView.bind(this)
		);

		/**
		 * Category Routes
		 */
		router.get("/admin/gc/categories", this.serveCategoryView.bind(this));

		router.get("/admin/category", this.getAllCategory.bind(this));
		router.post(
			"/admin/category",
			this.upload.single("image"),
			this.saveCategory.bind(this)
		);

		/**
		 * Transaction Routes
		 */
		router.get("/admin/transaction/", this.serveTransactionView.bind(this));
		router.get("/admin/transactions", this.getTransaction.bind(this));
		router.post("/admin/transactions", this.updateTransaction.bind(this));

		/**
		 * Wallets Routes
		 */
		router.get("/admin/wallet/:id", this.getWalletByUser.bind(this));

		/**
		 * Gift Code Routes
		 */
		router.get("/admin/giftcodes", this.serveCodeView.bind(this));
		router.get("/admin/codesbytransaction", this.getAllCodes.bind(this));
		router.post("/admin/bulkactivation", this.bulkAction.bind(this));

		/**
		 * Users Routes
		 */
		router.get("/admin/users", this.serveUserView.bind(this));
		router.get("/admin/user", this.getUsers.bind(this));

		/**
		 * Rates Routes
		 */
		router.get("/admin/exchange-rates", this.serveRateView.bind(this));
		router.get("/admin/rate", this.getRateOperation.bind(this));
		router.post("/admin/rate", this.saveRate.bind(this));
		router.post("/admin/rate/status", this.toggleStatus.bind(this));
		router.delete("/admin/rate", this.removeRate.bind(this));

		/**
		 * Orders Routes
		 */
		router.get("/admin/orders", this.serveOrdersView.bind(this));
		router.get("/admin/order", this.getOrderOperation.bind(this));
		router.post("/admin/order", this.processOrder.bind(this));

		/**
		 * Profile Routes
		 */
		router.get("/admin/profile", this.serveProfileView.bind(this));

		/**
		 * Bank Account Route
		 */
		router.get("/admin/bkaccount", this.getAccount.bind(this));
		router.post("/admin/bkaccount", this.saveAccount.bind(this));

		router.get("/admin/getUserAccount/:id", this.getUserAccount.bind(this));

		/**
		 * Bitcoin Wallet Route
		 */
		router.get("/admin/wallet", this.getWallet.bind(this));
		router.post("/admin/wallet", this.saveWallet.bind(this));

		/**
		 * Payout Vendor Route
		 */
		router.get("/admin/payment-vendor", this.servePaymentVendorView.bind(this));
		router.get("/admin/paymentvendor", this.getPaymentVendors.bind(this));
		router.post("/admin/paymentvendor", this.saveVendor.bind(this));
		router.delete("/admin/paymentvendor", this.removePaymentVendor.bind(this));
		

		/**
		 * Miscellenous Route
		 */
		router.get("/admin/banks", this.fetchBanks.bind(this));
		router.get("/admin/analytics", this.sendMetrics.bind(this));
	}

	private serveUserView(req: Request, res: Response) {
		res.render("admin/user", {
			title: "User",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isUser: true
		});
	}

	private serveDashboardView(req: Request, res: Response) {
		res.render("admin/index", {
			title: "Dashboard",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isDashboard: true
		});
	}

	private serveOrdersView(req: Request, res: Response) {
		res.render("admin/orders", {
			title: "Orders",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isDashboard: true
		});
	}

	private serveCategoryView(req: Request, res: Response) {
		res.render("admin/gccategory", {
			title: "GC Category",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isCategory: true
		});
	}

	private serveTransactionView(req: Request, res: Response) {
		let category = req.query.category;

		if (category == "sales") this.serveSalesTransactionView(req, res);
		else if (category == "purchase")
			this.servePurchaseTransactionView(req, res);
	}

	private serveSalesTransactionView(req: Request, res: Response) {
		res.render("admin/sales-transaction", {
			title: "Transactions",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isSalesTransaction: true
		});
	}

	private servePurchaseTransactionView(req: Request, res: Response) {
		res.render("admin/purchase-transaction", {
			title: "Transactions",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isPurchaseTransaction: true
		});
	}

	private serveCodeView(req: Request, res: Response) {
		res.render("admin/codes", {
			title: "Gift Codes",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isCodes: true
		});
	}

	private servePaymentVendorView(req: Request, res: Response) {
		res.render("admin/payment-vendor", {
			title: "Payout Vendors",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isPayout: true
		});
	}

	private serveRateView(req: Request, res: Response) {
		res.render("admin/rate", {
			title: "Rates",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isRate: true
		});
	}

	private serveProfileView(req: Request, res: Response) {
		res.render("admin/profile", {
			title: "Profile",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isRate: true
		});
	}

	private async saveCategory(req: Request, res: Response) {
		// console.log("here");
		// console.log(req.body);
		// console.log(req.body.id == "null");
		if (req.body.id && req.body.id == "null") {
			// console.log("")
			console.log("creating category");
			// create new
			let gcc = new GiftCodeCategory();
			let newGcc: GiftCodeCategory;

			if (req.file) {
				let filePath = req.file.path;
				gcc = { ...req.body };
				newGcc = await this._gcController.saveGcc(gcc, filePath);
			} else {
				gcc = { ...req.body };
				newGcc = await this._gcController.saveGcc(gcc, null);
			}

			return res.send({
				status: "created",
				data: newGcc
			});
		} else if (req.body.id && req.body.id != "null") {
			console.log("updating catgeory");
			let gcc = new GiftCodeCategory();
			let updatedGcc: GiftCodeCategory;

			if (req.file) {
				let filePath = req.file.path;
				gcc = { ...req.body };
				updatedGcc = await this._gcController.saveGcc(gcc, filePath);
			} else {
				gcc = { ...req.body };
				updatedGcc = await this._gcController.saveGcc(gcc, null);
			}

			return res.send({
				status: "updated",
				data: updatedGcc
			});
		}
	}

	private async getAllCategory(req: Request, res: Response) {
		let gccs = await this._gcController.getAllGCCs();
		return res.send({
			status: "read",
			data: gccs
		});
	}

	private async getTransaction(req: Request, res: Response) {
		let transactionCategory = req.query.category;

		let transactions;
		if (transactionCategory == "sales") {
			transactions = await this._userController.getSalesTransaction();
		} else if (transactionCategory == "purchase") {
			transactions = await this._userController.getPurchaseTransaction();
		}

		return res.send({
			status: "read",
			data: transactions
		});
	}

	private async getWalletByUser(req: Request, res: Response) {
		let uwallet = await this._userController.getWallet(req.params.id);
		return res.send({
			status: "read",
			data: uwallet
		});
	}

	private async updateTransaction(req: Request, res: Response) {
		let transactId = req.query.tid;
		let operation = req.query.operation;

		let newTransaction = await this._userController.updateTransaction(
			transactId,
			operation
		);

		return res.send({
			status: "update",
			data: newTransaction
		});
	}

	private async getAllCodes(req: Request, res: Response) {
		let transactions = await this._userController.getAllCodesByTransaction();
		return res.send({
			status: "read",
			data: transactions
		});
	}

	private async getRateOperation(req: Request, res: Response) {
		if (req.query && req.query.id) {
			let rate = await this._userController.getRateById(req.query.id);
			return res.send({
				status: "read",
				data: rate
			});
		}

		let rates = await this._userController.getAllRate();
		return res.send({
			status: "read",
			data: rates
		});
	}

	private async saveRate(req: Request, res: Response) {
		let rate = await this._userController.saveRate(req.body);

		if (req.body.id == 0) {
			return res.send({
				status: "create",
				data: rate
			});
		} else if (req.body.id != 0) {
			return res.send({
				status: "update",
				data: rate
			});
		}
	}

	private async fetchBanks(req: Request, res: Response) {
		const banks = await this._paystackService.fetchBanks();
		return res.send({
			status: "read",
			data: banks
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

	private async getUserAccount(req: Request, res: Response) {
		const uacc = await this._userController.getAccount(req.params.id);

		return res.send({
			status: "read",
			data: uacc
		});
	}

	private async toggleStatus(req: Request, res: Response) {
		let { isactive, id } = req.body;

		if (isactive === true) {
			let response = await this._userController.deactiveRate(id);

			return res.send({
				status: "true",
				data: response
			});
		} else if (isactive === false) {
			let response = await this._userController.activateRate(id);

			if (typeof response === "string") {
				// an error is returned
				return res.send({
					status: "false",
					data: response
				});
			}

			return res.send({
				status: "true",
				data: response
			});
		}
	}

	private async removeRate(req: Request, res: Response) {
		let rateId = req.query.id;

		let response = await this._userController.removeRate(rateId);

		return res.send({
			status: "true",
			data: response
		});
	}

	private async getOrderOperation(req: Request, res: Response) {
		if (req.query && req.query.id) {
			// get order by id function
			let order = await this._userController.getOrderById(req.query.id);
			return res.send({
				status: "true",
				data: order
			});
		}

		let orders = await this._userController.getAllOrder();
		return res.send({
			status: "true",
			data: orders
		});
	}

	private async processOrder(req: Request, res: Response) {
		let {uid, oid } = req.body;

		let user = new User();
		user.id = uid;

		let response = await this._userController.processOrder(oid, user);

		return res.send({
			status: "true",
			data: response
		});
	}

	private async getUsers(req: Request, res: Response) {
		let response = await this._userController.getAllUsers();

		res.send({
			status: "read",
			data: response
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

	private async bulkAction(req: Request, res: Response){
		let {payload, operation} = req.body;

		let response = await this._userController.bulkAction(payload, operation);
		console.log(response);
		return res.send({
			status: "done",
			data: response
		});
	}

	private async getPaymentVendors(req: Request, res: Response){

		var id = req.query.id;
		let response;

		if(id == null)
			response = await this._userController.getAllVendors();
		else
			response = await this._userController.getVendor(id);

		return res.send({
			status: "read",
			data: response
		});
	}

	private async saveVendor(req: Request, res: Response){
		console.log(req.body)

		let payload = req.body;
		
		let vendor = await this._userController.saveVendor(payload);

		if(payload.id == null){
			return res.send({
				status: "create",
				data: vendor
			});
		}else{
			return res.send({
				status: "update",
				data: vendor
			});
		}
	}

	private async removePaymentVendor(req: Request, res: Response){
		let pvId = req.query.id;

		let response = await this._userController.removeVendor(pvId);

		return res.send({
			status: "true",
			data: response
		});
	}

	private async sendMetrics(req: Request, res: Response){
		
		let response = await this._userController.sendMetrics();

		return res.send({
			status: "true",
			data: response
		});
	}
	
}
