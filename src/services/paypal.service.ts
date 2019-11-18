import { injectable } from "inversify";
import * as checkoutNodeJssdk from "@paypal/checkout-server-sdk";

import config from "../config";
import DIContainer from "../container/DIContainer";
import { GiftCodeService } from "./../services/gc.service";

@injectable()
export class PayPalService {
	private _gcService: GiftCodeService = DIContainer.resolve<GiftCodeService>(
		GiftCodeService
	);

	public async handleRequestVerification(
		orderId: number,
		totalAmount: any
	): Promise<any> {
		console.log("handling request verification");
		var request;

		try {
			request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
		} catch (error) {
			console.error(error);
			return error;
		}

		let order;
		try {
			order = await this.client().execute(request);

			console.log(order);
			if (order.result.purchase_units[0].amount.value != totalAmount) {
				return order;
			}
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	public async handleRequest(user: any, orderId: number, totalAmount: any) {
		console.log("handling request");
		/**1.
		 * a sort of confirmation mechanism to verify if the person wh is logged in
		 *	is the same as the person who paid
        //  */
		try {
			let order = await this.handleRequestVerification(orderId, totalAmount);
			let paymentId = order.result.payer.payer_id;

			return await this._gcService.scaffoldUserCode(user, paymentId);
		} catch (error) {
			console.error(error);
			return "error";
		}
	}

	public client() {
		return new checkoutNodeJssdk.core.PayPalHttpClient(this.environment());
	}

	public environment() {
		let clientId = process.env.PAYPAL_CLIENT_ID;
		let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

		// console.log(config.environment === "production");

		if (config.environment === "production") {
			console.log("production");
			return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
		} else if (config.environment === "development") {
			console.log("sandbox");
			return new checkoutNodeJssdk.core.SandboxEnvironment(
				clientId,
				clientSecret
			);
		}

		return {error: "environment unknown"};
	}
}
