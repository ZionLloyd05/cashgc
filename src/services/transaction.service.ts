import { RateService } from "./rate.service";
import { GiftCode } from "./../models/GiftCode";
import { DatabaseProvider } from "./../database/index";
import { Transaction } from "./../models/Transaction";
import { injectable } from "inversify";
import { createQueryBuilder } from "typeorm";
import DIContainer from "../container/DIContainer";

@injectable()
export class TransactionService {
	private _rService: RateService = DIContainer.resolve<RateService>(
		RateService
	);

	private MAXIMUM_TRANSACTION_AMOUNT: number;
	/**
	 *
	 */
	constructor() {
		this.MAXIMUM_TRANSACTION_AMOUNT = 500;
	}

	public async createTransaction(payload: any): Promise<Transaction> {
		const db = await DatabaseProvider.getConnection();
		var transaction = new Transaction();
		let giftCodesArr: GiftCode[] = [];

		let { payment, type } = payload;

		if (payment === 2 && type === 1) {
			console.log(payload);
			payload.amount = await this._rService.convertDollarToNaira(
				Number(payload.amount)
			);
			console.log(payload);
			// confirm if transaction can fly
			// let result = await this.canMakeTransaction(payload.user.id, payload.amount);
			// console.log(result);
			// if(!result){
			// 	console.log("Limit reached");
			// 	return null;
			// }

			//sales and payment with bitcoin
			// payload.gcodes.forEach(codeId =>)
			console.log("sales and payment with bitcoin");

			// set all coin to is used
			payload.gcodes &&
				payload.gcodes.forEach(async codeId => {
					await this.setCodeToUsed(codeId);
				});
		} else if (payment === 1 && type === 1) {
			// // confirm if transaction can fly
			// let result = await this.canMakeTransaction(payload.user.id, payload.amount);
			// console.log(result);
			// if(!result){
			// 	console.log("Limit reached");
			// 	return null;
			// }

			//sales and payment with paystack
			// console.log("sales and payment with paystack");

			// set all coin to is used
			payload.gcodes &&
				payload.gcodes.forEach(async codeId => {
					await this.setCodeToUsed(codeId);
				});
		} else if (payment === 0 && type === 0) {
			//buy and ofcourse payment with paypal
			// console.log("buy and ofcourse payment with paypal");
		} else if (payment === 3 && type === 0) {
			// console.log("buy and pay with bank payment");
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
			payment: payload.payment,
			paymentRef: payload.paymentRef,
			amount: payload.amount
		};

		transaction = { ...newPayload };
		return await db.getRepository("Transaction").save(transaction);
	}

	public async updateTransactionWithGcodes(gcodes: any, transactionId: number) {
		let db = await DatabaseProvider.getConnection();
		let giftCodesArr: GiftCode[] = [];

		let transactionInDb = await this.getTransactionById(transactionId);
		// console.log(transactionInDb);

		if (gcodes.length > 0) {
			gcodes.forEach(codeId => {
				let giftCode = new GiftCode();
				giftCode.id = codeId;
				giftCodesArr.push(giftCode);
			});
		}

		transactionInDb.giftCodes = giftCodesArr;

		/**
		 * @TODOD auto generate a payment ref
		 */
		return await db.getRepository("Transaction").save(transactionInDb);
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

	public async getTransactionById(transactionId: number): Promise<any> {
		let db = await DatabaseProvider.getConnection();
		return await db.getRepository(Transaction).findOne(transactionId);
	}

	public async getUserTransactions(userid: number): Promise<any[]> {
		let db = await DatabaseProvider.getConnection();
		let transactions = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.innerJoinAndSelect("transaction.giftCodes", "giftCodes")
			.innerJoinAndSelect("giftCodes.giftCodeCategory", "giftCodeCategory")
			.where({ user: userid })
			.orderBy({
				"transaction.id": "DESC"
			})
			.getMany();
		// console.log(transactions);
		return transactions;
	}

	public async getUserTransactionsAlone(userid: number): Promise<any[]> {
		let db = await DatabaseProvider.getConnection();
		let transactions = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.where({ user: userid })
			.orderBy({
				"transaction.id": "DESC"
			})
			.getMany();
		// console.log(transactions);
		return transactions;
	}

	public async getUserCodesByTransaction(
		userid: number,
		tid: number
	): Promise<any[]> {
		let db = await DatabaseProvider.getConnection();
		let transaction = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.where({ user: userid })
			.andWhere("transaction.id = :transactionId")
			.innerJoinAndSelect("transaction.giftCodes", "giftCodes")
			.innerJoinAndSelect("giftCodes.giftCodeCategory", "giftCodeCategory")
			.setParameters({ transactionId: tid })
			.orderBy({
				"transaction.id": "DESC"
			})
			.getMany();

		return transaction;
	}

	public async getAllCodesByTransaction(): Promise<any[]> {
		let db = await DatabaseProvider.getConnection();
		let transaction = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.innerJoinAndSelect("transaction.giftCodes", "giftCodes")
			.innerJoinAndSelect("giftCodes.giftCodeCategory", "giftCodeCategory")
			.orderBy({
				"transaction.id": "DESC"
			})
			.getMany();

		return transaction;
	}

	public async getAllTransaction(): Promise<any[]> {
		let db = await DatabaseProvider.getConnection();
		let transactions = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.orderBy({
				"transaction.id": "DESC"
			})
			.getMany();

		return transactions;
	}

	public async getSalesTransaction(): Promise<any[]> {
		let db = await DatabaseProvider.getConnection();
		let transactions = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.where({ type: "1" })
			.orderBy({
				"transaction.id": "DESC"
			})
			.getMany();

		return transactions;
	}

	public async getPurchaseTransaction(): Promise<any[]> {
		let db = await DatabaseProvider.getConnection();
		let transactions = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.where({ type: "0" })
			.orderBy({
				"transaction.id": "DESC"
			})
			.getMany();

		return transactions;
	}

	public async approveBitcoinTransaction(tid: number): Promise<any> {
		let db = await DatabaseProvider.getConnection();

		await createQueryBuilder("Transaction")
			.update(Transaction)
			.set({ status: 0 })
			.where("id = :id", { id: tid })
			.execute();

		let newTransaction = await db.getRepository("transaction").findOne({
			relations: ["user"],
			where: { id: tid }
		});

		return newTransaction;
	}

	public async declineBitcoinTransaction(tid: number): Promise<any> {
		let db = await DatabaseProvider.getConnection();

		await createQueryBuilder("Transaction")
			.update(Transaction)
			.set({ status: 1 })
			.where("id = :id", { id: tid })
			.execute();

		let newTransaction = await db.getRepository("transaction").findOne({
			relations: ["user"],
			where: { id: tid }
		});

		return newTransaction;
	}

	public async setTransactionStatusToSuccess(tid: number): Promise<any> {
		let db = await DatabaseProvider.getConnection();

		await createQueryBuilder("Transaction")
			.update(Transaction)
			.set({ status: 0 })
			.where("id = :id", { id: tid })
			.execute();

		let newTransaction = await db.getRepository("transaction").findOne({
			where: { id: tid }
		});

		return newTransaction;
	}

	public async canUserTransact(userId: number): Promise<any> {}

	public async getAllTransactionForUser(userId: number): Promise<any> {
		let db = await DatabaseProvider.getConnection();

		let userTransactions = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.where("transaction.user.id = :uid", { uid: userId })
			.orderBy({
				"transaction.id": "DESC"
			})
			.getMany();

		return userTransactions;
	}

	public async getUserTransactionsWithinLast24Hours(
		userId: number
	): Promise<any> {
		let last24HoursDate = this.returnLast24HoursDate();

		let db = await DatabaseProvider.getConnection();
		let transactions = await db
			.getRepository("transaction")
			.createQueryBuilder("transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.where(
				`transaction.createdAt >= :startDate AND transaction.createdAt <= :endDate AND transaction.user.id = :userId`,
				{ startDate: last24HoursDate, endDate: new Date(), userId }
			)
			.orderBy({
				"transaction.id": "DESC"
			})
			.getMany();

		return transactions;
	}

	public async canMakeTransaction(
		userId: number,
		currentTransactionAmount: number
	): Promise<Boolean> {
		// console.log(currentTransactionAmount);
		let transactions = await this.getUserTransactionsWithinLast24Hours(userId);
		// console.log(transactions)
		let totalTransactionAmount = this.totalAmountInTransactions(transactions);
		// console.log(totalTransactionAmount)
		let currentTransactionAmountInNaira = await this._rService.convertDollarToNaira(
			currentTransactionAmount
		);
		let supposedTransactionTotal =
			totalTransactionAmount + currentTransactionAmountInNaira;
		// console.log(supposedTransactionTotal);
		let maxAmount = await this.getDollar(this.MAXIMUM_TRANSACTION_AMOUNT);
		// console.log(maxAmount)
		if (supposedTransactionTotal > maxAmount) return false;
		else return true;
	}

	/**
	 * Helper methods
	 */
	private async getDollar(amount: number) {
		return await this._rService.convertDollarToNaira(amount);
	}
	public totalAmountInTransactions(transactions: [Transaction]): number {
		let total = 0;
		transactions.forEach(transaction => {
			total += transaction.amount;
		});

		return total;
	}
	private returnLast24HoursDate = function() {
		let today = new Date();

		let dayBeforeTimestamp = today.setDate(today.getDate() - 1);

		let dayBefore = new Date(dayBeforeTimestamp);

		return dayBefore;
	};
	private daysBetween = function(date1, date2) {
		//Get 1 day in milliseconds
		var one_day = 1000 * 60 * 60 * 24;

		// Convert both dates to milliseconds
		var date1_ms = date1.getTime();
		var date2_ms = date2.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = date2_ms - date1_ms;

		// Convert back to days and return
		return Math.round(difference_ms / one_day);
	};

	private isWithin24Hours = function(lastTransactionDate: Date) {
		var today = new Date();
		var day = this.daysBetween(lastTransactionDate, today);

		if (day > 0) {
			return false;
		}

		return true;
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
