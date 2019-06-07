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

		payload.gcodes.forEach(codeId => {
			let giftCode = new GiftCode();
			giftCode.id = codeId;
			giftCodesArr.push(giftCode);
		});
		let newPayload = {
			status: payload.status,
			type: payload.type,
			giftCodes: giftCodesArr,
			user: payload.user
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
			.getMany();

		return transactions;
	}
}
