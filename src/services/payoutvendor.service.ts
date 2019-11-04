import { SharedService } from "./shared.service";
import { PayoutVendor } from "../models/PayoutVendor";
import { DatabaseProvider } from "../database/index";
import { Request, Response } from "express";
import DIContainer from "../container/DIContainer";
import { injectable } from "inversify";

@injectable()
export class PayoutVendorService {
	private _sharedService: SharedService = DIContainer.resolve<SharedService>(
		SharedService
	);

	// private async togglePayoutStatus(payoutId: number, slug: string) {
	// 	const db = await DatabaseProvider.getConnection();

	// 	const payoutRepo = db.getRepository(PayoutService);
    // }
    
    
	public async getPVendorById(id: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		const rateRepo = await db.getRepository(PayoutVendor);
		return await rateRepo.findOne(id);
	}

	public async createVendor(vendorPayload: PayoutVendor): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		let newPaymentVendor = new PayoutVendor();
		let { name, category, isAvailable } = vendorPayload;

		newPaymentVendor.name = name;
		newPaymentVendor.category = category;
		newPaymentVendor.isAvailable = isAvailable;
		newPaymentVendor.slug = this.createSlug(name);

		return await db.getRepository("PayoutVendor").save(newPaymentVendor);
    }
    
    public async updateVendor(vendorPayload): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const pvRepo = db.getRepository(PayoutVendor);

		let payoutVendorInDb = await this.getPVendorById(vendorPayload.id);

		let { name, category, isAvailable } = vendorPayload;

		payoutVendorInDb.name = name;
		payoutVendorInDb.category = category;
		payoutVendorInDb.isAvailable = isAvailable;

		return await pvRepo.save(payoutVendorInDb);
    }
        
	public async removePayoutVendor(pvId: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const pvRepo = db.getRepository(PayoutVendor);

		let paymentVendorToRemove = await this.getPVendorById(pvId);
		await pvRepo.remove(paymentVendorToRemove);
	}


	public async getAllVendor(): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		return await db
			.getRepository("PayoutVendor")
			.createQueryBuilder("PayoutVendor")
			.orderBy({
				"PayoutVendor.id": "DESC"
			})
			.getMany();
	}

	private createSlug(vendorName: string): string {
		var sub = vendorName.substring(0, 3).toLowerCase();
		var tok = this._sharedService.generateToken(3);
		return sub + "_" + tok;
	}
}
