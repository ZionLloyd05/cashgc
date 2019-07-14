import { GiftCodeCategory } from "./../models/GiftCodeCategory";
import { DatabaseProvider } from "./../database/index";
import { GiftCode } from "./../models/GiftCode";
import * as crypto from "crypto";
import { injectable } from "inversify";
import { createQueryBuilder } from "typeorm";

@injectable()
export class GiftCodeService {
	/**
	 *
	 */
	constructor() {}

	create = (code: string, gc: GiftCodeCategory) => {
		return new Promise<GiftCode>(async (resolve, reject) => {
			const db = await DatabaseProvider.getConnection();
			const gcRepo = db.getRepository("GiftCode");
			let newGc = new GiftCode();
			newGc.code = code;
			newGc.giftCodeCategory = gc;
			let createdGc = await gcRepo.save(newGc);
			resolve(createdGc);
		});
	};

	generateToken = () => {
		return new Promise(async (resolve, reject) => {
			let db = await DatabaseProvider.getConnection();

			let token = crypto.randomBytes(10).toString("hex");
			let gcInDb = await db.getRepository("GiftCode").findOne({ code: token });
			if (gcInDb != undefined) return this.generateToken();

			resolve(token);
		});
	};

	generateCodes = async (cartItem: any[]) => {
		let generatedCodes = [];

		await this.asyncForEach(cartItem, async item => {
			let quantity = item.quantity;
			let prefix = item.giftCodeCategory.prefix;
			let gc = item.giftCodeCategory;
			let itemArr = [];

			for (let x = 0; x < quantity; x++) {
				let token = prefix + "" + (await this.generateToken());
				let giftCodeObj = await this.create(token, gc);
				let giftCode = giftCodeObj.code;
				generatedCodes.push(giftCodeObj.id);
			}
		});

		return generatedCodes;
	};

	getUserCodes = async () => {
		const db = await DatabaseProvider.getConnection();
		const gcRepo = db.getRepository("GiftCode");

		const citems = await createQueryBuilder("GiftCode")
			.innerJoinAndSelect(
				"GiftCode.giftCodeCategory",
				"gcc",
				"GiftCode.giftCodeCategory = gcc.id"
			)
			.getMany();
		return citems;
	};

	getGCbyCode = async (token: string): Promise<any> | null => {
		const db = await DatabaseProvider.getConnection();
		console.log(token);
		let gcInDb = await db.getRepository("GiftCode").findOne({
			relations: ["giftCodeCategory"],
			where: { code: token }
		});
		return gcInDb;
	};

	/**
	 * asynchronous version for .forEach methos
	 */
	asyncForEach = async (array, callback) => {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	};
}
