import { GiftCodeCategory } from "./../models/GiftCodeCategory";
import { injectable, inject } from "inversify";
import { GCCService } from "../services/gcc.service";

@injectable()
export class GccController {
	private _gccService: GCCService;

	constructor(@inject(GCCService) gccService: GCCService) {
		/**
		 * Declaring DIs */
		this._gccService = gccService;
	}

	/**
	 * Saves gift code category.
	 * Creates if gcCategory.ID attr is empty and
	 * Updates if gcCategory.ID attr is not empty
	 *
	 * @param gcCategory : GiftCodeCategory Object
	 * @param filePath : GiftCodeCategory Image path
	 */
	public async saveGcc(
		gcCategory: any,
		filePath: any
	): Promise<GiftCodeCategory> {
		if (gcCategory.id && gcCategory.id != "null") {
			// update giftCodeCategory logic
			console.log("updating from controller");
			const updatedGcc = await this._gccService.update(gcCategory, filePath);
			return updatedGcc;
		} else {
			// create giftCodeCategory logic
			console.log("creating from controller");
			const newGcc = await this._gccService.create(gcCategory, filePath);
			return newGcc;
		}
	}

	/**
	 * Fetch Gift code category by id
	 * @param id
	 */
	public async getGccById(id: number): Promise<GiftCodeCategory> {
		return await this._gccService.getById(id);
	}

	/**
	 * Fetch all Gift code categories
	 */
	public async getAllGCCs(): Promise<GiftCodeCategory[]> {
		return await this._gccService.getAll();
	}

	/**
	 * Fetch all available Gift Code Categories
	 */
	public async getActiveGccs(): Promise<GiftCodeCategory[]> {
		let activeGccs = await this._gccService.getActiveCategories();
		return activeGccs;
	}
}
