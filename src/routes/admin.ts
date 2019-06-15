import { GiftCodeCategory } from "./../models/GiftCodeCategory";
import { GccController } from "./../controllers/gcc.ctrl";
import { AuthService } from "./../services/auth.service";
import { Router, Request, Response } from "express";
import { IRoute } from "./IRoute";
import * as csurf from "csurf";
import DIContainer from "../container/DIContainer";
import * as multer from "multer";

export class AdminRoute implements IRoute {
	private _authService: AuthService = DIContainer.resolve<AuthService>(
		AuthService
	);
	private _gcController: GccController = DIContainer.resolve<GccController>(
		GccController
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
			title: "Dashboard",
			layout: "adminLayout",
			csrfToken: req.csrfToken(),
			isDashboard: true
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
		// console.log(req.body);
		// return res.send(req.body);
		// let gcc = new GiftCodeCategory();
		// gcc = { ...req.body };
		// this._gcController
		// 	.saveGcc(gcc)
		// 	.then(data => {
		// 		return res.send({
		// 			status: "created",
		// 			data
		// 		});
		// 	})
		// 	.catch(error => {
		// 		console.log(error);
		// 		return res.send({
		// 			status: "error",
		// 			data: error
		// 		});
		// 	});
	}

	private async getAllCategory(req: Request, res: Response) {
		let gccs = await this._gcController.getAllGCCs();
		return res.send({
			status: "read",
			data: gccs
		});
	}
}
