import { GiftCodeCategory } from "../models/GiftCodeCategory";
import { injectable } from "inversify";
import { DatabaseProvider } from "../database/index";
import * as cloudinary from "cloudinary";
import config from "../config";

@injectable()
export class GCCService {
	private cloudinary: any;
	/**
	 *
	 */
	constructor() {
		this.cloudinary = cloudinary.config({
			cloud_name: config.cloudName,
			api_key: config.apiKey,
			api_secret: config.apiSecret
		});
	}
	public async create(
		gcCategory: any,
		filePath: any
	): Promise<GiftCodeCategory> {
		console.log(gcCategory);
		console.log("creating from service");
		const db = await DatabaseProvider.getConnection();

		let newGCCategory = new GiftCodeCategory();
		let { isAvailable } = gcCategory;

		if (filePath != null) {
			const imageUrl = await this.uploadImage(filePath);
			gcCategory.imageUrl = imageUrl;

			newGCCategory = { ...gcCategory };
			if (isAvailable == "true") newGCCategory.isAvailable = true;
			else if (isAvailable == "false") newGCCategory.isAvailable = false;
		} else {
			newGCCategory = { ...gcCategory };
			if (isAvailable == "true") newGCCategory.isAvailable = true;
			else if (isAvailable == "false") newGCCategory.isAvailable = false;
		}

		return await db.getRepository(GiftCodeCategory).save(newGCCategory);
	}

	public async update(
		gcCategory: any,
		filePath: any
	): Promise<GiftCodeCategory> {
		const db = await DatabaseProvider.getConnection();
		const gccRepository = db.getRepository(GiftCodeCategory);
		let gccInDb = await gccRepository.findOne(gcCategory.id);

		let {
			title,
			imageUrl,
			sellingPrice,
			buyingPrice,
			prefix,
			isAvailable
		} = gcCategory;

		if (filePath != null) {
			let imageUrl = await this.uploadImage(filePath);
			gccInDb.imageUrl = imageUrl;

			gccInDb.title = title;
			gccInDb.sellingPrice = sellingPrice;
			gccInDb.buyingPrice = buyingPrice;
			gccInDb.prefix = prefix;
			if (isAvailable == "true") gccInDb.isAvailable = true;
			else if (isAvailable == "false") gccInDb.isAvailable = false;
		} else {
			gccInDb.imageUrl = imageUrl;
			gccInDb.title = title;
			gccInDb.sellingPrice = sellingPrice;
			gccInDb.buyingPrice = buyingPrice;
			gccInDb.prefix = prefix;
			if (isAvailable == "true") gccInDb.isAvailable = true;
			else if (isAvailable == "false") gccInDb.isAvailable = false;
		}

		return await gccRepository.save(gccInDb);
	}

	public async uploadImage(filePath: any): Promise<string> {
		const result = await cloudinary.uploader.upload(filePath);
		console.log(result);
		return result.secure_url;
	}

	public async getById(id: number): Promise<GiftCodeCategory> {
		const db = await DatabaseProvider.getConnection();

		const gccRepository = await db.getRepository(GiftCodeCategory);
		return await gccRepository.findOne(id);
	}

	public async getAll(): Promise<GiftCodeCategory[]> {
		const db = await DatabaseProvider.getConnection();
		return await db.getRepository(GiftCodeCategory).find();
	}

	public async toggleStatus(id: number): Promise<GiftCodeCategory> {
		const db = await DatabaseProvider.getConnection();
		let gccInDb = await this.getById(id);
		if (gccInDb.isAvailable == true) gccInDb.isAvailable = false;
		else if (gccInDb.isAvailable == false) gccInDb.isAvailable = true;

		return await db.getRepository(GiftCodeCategory).save(gccInDb);
	}

	public async getActiveCategories(): Promise<GiftCodeCategory[]> {
		const db = await DatabaseProvider.getConnection();

		return await db.getRepository(GiftCodeCategory).find({ isAvailable: true });
	}
}
