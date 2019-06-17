import { GiftCode } from "./../models/GiftCode";
import { DatabaseProvider } from "./../database/index";
import { Transaction } from "./../models/Transaction";
import { injectable } from "inversify";
import * as checkoutNodeJssdk from "@paypal/checkout-server-sdk";
// import * as payPalClient from "../common/paypalClient.js";

@injectable()
export class TransactionService {
	public async createTransaction(payload: any): Promise<Transaction> {
		const db = await DatabaseProvider.getConnection();
		var transaction = new Transaction();
		let giftCodesArr: GiftCode[] = [];

		let { payment, type } = payload;

		if (payment === 2 && type === 1) {
			//sales and payment with bitcoin
			// payload.gcodes.forEach(codeId =>)
			console.log("sales and payment with bitcoin");

			// set all coin to is used
			payload.gcodes &&
				payload.gcodes.forEach(async codeId => {
					await this.setCodeToUsed(codeId);
				});
		} else if (payment === 1 && type === 1) {
			//sales and payment with paystack
			console.log("sales and payment with paystack");
		} else if (type === 0) {
			//buy and ofcourse payment with paypal
			console.log("buy and ofcourse payment with paypal");
		}

		payload.gcodes &&
			payload.gcodes.forEach(codeId => {
				let giftCode = new GiftCode();
				giftCode.id = codeId;
				giftCodesArr.push(giftCode);
			});

		let newPayload = {
			status: payload.status,
			type: payload.type,
			giftCodes: giftCodesArr,
			user: payload.user,
			payment: payload.payment
		};
		transaction = { ...newPayload };
		return await db.getRepository("Transaction").save(transaction);
	}

	public async setCodeToUsed(codeId: number): Promise<void> {
		const db = await DatabaseProvider.getConnection();
		const gcRepo = await db.getRepository(GiftCode);
		// console.log(codeId);

		let gcInDb = await gcRepo.findOne({
			where: { id: codeId }
		});
		// console.log(gcInDb);

		if (gcInDb) gcInDb.isUsed = true;

		await gcRepo.save(gcInDb);
	}

	public async getUserTransaction(userid: number): Promise<any[]> {
		let db = await DatabaseProvider.getConnection();
		let transactions = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.where({ user: userid })
			.innerJoinAndSelect("transaction.giftCodes", "giftCodes")
			.innerJoinAndSelect("giftCodes.giftCodeCategory", "giftCodeCategory")
			.getMany();

		return transactions;
	}

	// public async veriftTransaction(
	// 	orderId: any,
	// 	amountToPay: number
	// ): Promise<number> {
	// 	const orderID = orderId;

	// 	let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

	// 	let order;

	// 	try {
	// 		order = await payPalClient.client().execute(request);
	// 	} catch (error) {
	// 		console.error(error);
	// 		return 500;
	// 	}

	// 	if (order.result.purchase_units[0].amount.value !== amountToPay) return 400;

	// 	return 200;
	// }

	/**
	 * asynchronous version for .forEach methos
	 */
	asyncForEach = async (array, callback) => {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	};
}
