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

	private async create(vendorPayload: PayoutVendor): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		let newPaymentVendor = new PayoutVendor();
		let { name, category, isAvailable } = vendorPayload;

		newPaymentVendor.name = name;
		newPaymentVendor.category = category;
		newPaymentVendor.isAvailable = isAvailable;
		newPaymentVendor.slug = this.createSlug(name);

		console.log(newPaymentVendor);
	}

	private createSlug(vendorName: string): string {
		var sub = vendorName.substring(0, 3);
		var tok = this._sharedService.generateToken(4);
		return sub + "_" + tok;
	}
}
