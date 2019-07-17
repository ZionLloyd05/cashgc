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
		router.get("/admin/transaction", this.serveTransactionView.bind(this));
		router.get("/admin/transactions", this.getAllTransaction.bind(this));
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

		/**
		 * Rates Routes
		 */
		router.get("/admin/exchange-rates", this.serveRateView.bind(this));
		router.get("/admin/rate", this.getRateOperation.bind(this));
		router.post("/admin/rate", this.saveRate.bind(this));
		router.post("/admin/rate/status", this.toggleStatus.bind(this));
		router.delete("/admin/rate", this.removeRate.bind(this));
	}

	private serveDashboardView(req: Request, res: Response) {
		res.render("admin/index", {
			title: "Dashboard",
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
		res.render("admin/transaction", {
			title: "Transactions",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isTransaction: true
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

	private serveRateView(req: Request, res: Response) {
		res.render("admin/rate", {
			title: "Rates",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isRate: true
		});
	}

	private async saveCategory(req: Request, res: Response) {
		console.log("here");
		console.log(req.body);
		console.log(req.body.id == "null");
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

	private async getAllTransaction(req: Request, res: Response) {
		let transactions = await this._userController.getAllTransaction();
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
	
		if(req.body.id == 0){
			return res.send({
				status: "create",
				data: rate
			});
		}
		else if(req.body.id != 0){
			return res.send({
				status: "update",
				data: rate
			});
		}
	}

	private async toggleStatus(req: Request, res: Response) {
		let {isactive , id} = req.body

		if(isactive === true){
			let response = await this._userController.deactiveRate(id);
			
			return res.send({
				status: "true",
				data: response
			})
		}else if(isactive === false){
			let response = await this._userController.activateRate(id);

			if(typeof response === "string"){
				// an error is returned
				return res.send({
					status: "false",
					data: response
				})
			}

			return res.send({
				status: "true",
				data: response
			})
		}
	}

	private async removeRate(req: Request, res: Response) {
		let rateId = req.query.id;

		let response = await this._userController.removeRate(rateId);

		return res.send({
			status: "true",
			data: response
		})
	}
}
