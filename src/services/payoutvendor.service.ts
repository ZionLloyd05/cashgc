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

		let newpayoutVendor = new PayoutVendor();
		let { name, category, isAvailable, info } = vendorPayload;

		newpayoutVendor.name = name;
		newpayoutVendor.category = category;
		newpayoutVendor.info = info;
		newpayoutVendor.isAvailable = isAvailable;
		newpayoutVendor.slug = this.createSlug(name);

		return await db.getRepository("PayoutVendor").save(newpayoutVendor);
    }
    
    public async updateVendor(vendorPayload): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const pvRepo = db.getRepository(PayoutVendor);

		let payoutVendorInDb = await this.getPVendorById(vendorPayload.id);

		let { name, category, isAvailable, info } = vendorPayload;

		payoutVendorInDb.name = name;
		payoutVendorInDb.info = info;
		payoutVendorInDb.category = category;
		payoutVendorInDb.isAvailable = isAvailable;

		return await pvRepo.save(payoutVendorInDb);
    }
        
	public async removePayoutVendor(pvId: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const pvRepo = db.getRepository(PayoutVendor);

		let payoutVendorToRemove = await this.getPVendorById(pvId);
		await pvRepo.remove(payoutVendorToRemove);
	}


	public async getAllVendor(): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const vendors = await db
			.getRepository("PayoutVendor")
			.createQueryBuilder("PayoutVendor")
			.orderBy({
				"PayoutVendor.id": "DESC"
			})
            .getMany();
        // console.log(vendors)
        return vendors;
    }
    
    public async getAllActiveVendors(): Promise<any> {
        let db = await DatabaseProvider.getConnection();
		let vendors = await db
			.getRepository("PayoutVendor")
			.createQueryBuilder("PayoutVendor")
            .where({ isAvailable: true })
            .andWhere("PayoutVendor.category = :category")
            .setParameters({ category: "Manual" })
			.orderBy({
				"PayoutVendor.id": "DESC"
			})
            .getMany();
            
        return vendors
    }

	private createSlug(vendorName: string): string {
		var sub = vendorName.substring(0, 3).toLowerCase();
		var tok = this._sharedService.generateToken(3);
		return sub + "_" + tok;
	}
}
