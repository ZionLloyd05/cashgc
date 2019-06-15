import { GiftCode } from "./../models/GiftCode";
import { DatabaseProvider } from "./../database/index";
import { Transaction } from "./../models/Transaction";
import { injectable } from "inversify";

@injectable()
export class TransactionService {
	public async createTransaction(payload: any): Promise<Transaction> {
		const db = await DatabaseProvider.getConnection();
		var transaction = new Transaction();
		let giftCodesArr: GiftCode[] = [];

		let {payment, type} = payload;

		if(payment === 2 && type === 1)
		{
			//sales and payment with bitcoin
			// payload.gcodes.forEach(codeId =>)
			console.log("sales and payment with bitcoin")
		}
		else if(payment === 1 && type === 1)
		{
			//sales and payment with paystack
			console.log("sales and payment with paystack")
		}
		else if(type === 0)
		{
			//buy and ofcourse payment with paypal
			console.log("buy and ofcourse payment with paypal")
			
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
}
