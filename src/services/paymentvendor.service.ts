import { SharedService } from "./shared.service";
import { PaymentVendor } from "../models/PaymentVendor";
import { DatabaseProvider } from "../database/index";
import { Request, Response } from "express";
import DIContainer from "../container/DIContainer";
import { injectable } from "inversify";

@injectable()
export class PaymentVendorService {
	private _sharedService: SharedService = DIContainer.resolve<SharedService>(
		SharedService
	);

	// private async togglePayoutStatus(payoutId: number, slug: string) {
	// 	const db = await DatabaseProvider.getConnection();

	// 	const payoutRepo = db.getRepository(PayoutService);
	// }

	public async getPVendorById(id: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		const pvRepo = await db.getRepository(PaymentVendor);
		return await pvRepo.findOne(id);
	}

	public async createVendor(vendorPayload: PaymentVendor): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		let newPaymentVendor = new PaymentVendor();
		let { name, category, isAvailable, info } = vendorPayload;

		newPaymentVendor.name = name;
		newPaymentVendor.category = category;
		newPaymentVendor.info = info;
		newPaymentVendor.isAvailable = isAvailable;
		newPaymentVendor.slug = this.createSlug(name);

		return await db.getRepository("PaymentVendor").save(newPaymentVendor);
	}

	public async updateVendor(vendorPayload): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const pvRepo = db.getRepository(PaymentVendor);

		let PaymentVendorInDb = await this.getPVendorById(vendorPayload.id);

		let { name, category, isAvailable, info } = vendorPayload;

		PaymentVendorInDb.name = name;
		PaymentVendorInDb.info = info;
		PaymentVendorInDb.category = category;
		PaymentVendorInDb.isAvailable = isAvailable;

		return await pvRepo.save(PaymentVendorInDb);
	}

	public async removePaymentVendor(pvId: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const pvRepo = db.getRepository(PaymentVendor);

		let PaymentVendorToRemove = await this.getPVendorById(pvId);
		await pvRepo.remove(PaymentVendorToRemove);
	}

	public async getAllVendor(): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const vendors = await db
			.getRepository("PaymentVendor")
			.createQueryBuilder("PaymentVendor")
			.orderBy({
				"PaymentVendor.id": "DESC"
			})
			.getMany();
		// console.log(vendors)
		return vendors;
	}

	public async getAllActiveVendors(): Promise<any> {
		let db = await DatabaseProvider.getConnection();
		let vendors = await db
			.getRepository("PaymentVendor")
			.createQueryBuilder("PaymentVendor")
			.where({ isAvailable: true })
			.andWhere("PaymentVendor.category = :category")
			.setParameters({ category: "Manual" })
			.orderBy({
				"PaymentVendor.id": "DESC"
			})
			.getMany();

		return vendors;
	}

	private createSlug(vendorName: string): string {
		var sub = vendorName.substring(0, 3).toLowerCase();
		var tok = this._sharedService.generateToken(3);
		return sub + "_" + tok;
	}
}
