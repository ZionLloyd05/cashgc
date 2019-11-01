import { AccountService } from "./../services/account.service";
import { OrderItemService } from "./../services/orderItem.service";
import { OrderService } from "./../services/order.service";
import { RateService } from "./../services/rate.service";
import { TransactionService } from "./../services/transaction.service";
import { CartItem } from "./../models/CartItem";
import { User, IUserDTO } from "./../models/User";
import { UserService } from "./../services/user.service";
import { injectable, inject } from "inversify";
import { GiftCodeService } from "./../services/gc.service";
import DIContainer from "../container/DIContainer";
// import { EventEmitter } from "events";

@injectable()
export class UserController {
	private _userService: UserService;
	private _gcService: GiftCodeService = DIContainer.resolve<GiftCodeService>(
		GiftCodeService
	);

	private _tService: TransactionService = DIContainer.resolve<
		TransactionService
	>(TransactionService);

	private _rService: RateService = DIContainer.resolve<RateService>(
		RateService
	);

	private _oService: OrderService = DIContainer.resolve<OrderService>(
		OrderService
	);

	private _oItemService: OrderItemService = DIContainer.resolve<
		OrderItemService
	>(OrderItemService);

	private _accService: AccountService = DIContainer.resolve<AccountService>(
		AccountService
	);

	constructor(@inject(UserService) userService: UserService) {
		this._userService = userService;
	}

	/**
	 * User Methods
	 */
	public async saveUser(user: any): Promise<IUserDTO> {
		if (user.id && user.id != null) {
			// update user logic
			// console.log("updating user");
			return await this._userService.update(user);
		} else {
			// create user logic
			const newUser = await this._userService.create(user);
			// this.userEvent.emit("new user", newUser);
			return newUser;
		}
	}
	public async getUserById(id: number): Promise<IUserDTO> {
		return await this._userService.getById(id);
	}
	public async getAllUsers(): Promise<IUserDTO[]> {
		let users = await this._userService.getAll();
		return users;
	}

	public async updatePassword(payload: any): Promise<any> {
		const { currentPassword, newPassword, email } = payload;
		return await this._userService.updatePassword(
			email,
			currentPassword,
			newPassword
		);
	}

	/**
	 * Cart Methods
	 */
	public async getCartItems(user: IUserDTO): Promise<any> {
		return await this._userService.getCartItem(user);
	}
	public async addToCart(
		gcId: number,
		userId: number,
		qty: number
	): Promise<boolean> {
		return await this._userService.addToCart(gcId, userId, qty);
	}
	public async clearCart(userId: number) {
		await this._userService.clearCart(userId);
	}

	public async removeFromCart(gccId: number, userId: number): Promise<any> {
		return await this._userService.removeFromCart(gccId, userId);
	}

	/**
	 * Gift Code Methods
	 */
	public async scaffoldCodes(cartItem: any): Promise<any> {
		let codes = await this._gcService.generateCodes(cartItem);
		return codes;
	}
	public async getUserCodes(): Promise<any> {
		let codes = await this._gcService.getUserCodes();
		return codes;
	}
	public async getGCbyCode(code: string): Promise<any> {
		let gcInDb = await this._gcService.getGCbyCode(code);
		return gcInDb;
	}

	/**
	 * Transaction Methods
	 */
	public async createTransaction(payload: any): Promise<any> {
		let transaction = await this._tService.createTransaction(payload);
		return transaction;
	}
	public async getUserTransactions(userId: number): Promise<any> {
		let transactions = await this._tService.getUserTransactions(userId);
		return transactions;
	}
	public async getUserTransactionsAlone(userId: number): Promise<any> {
		let transactions = await this._tService.getUserTransactionsAlone(userId);
		return transactions;
	}
	public async getUserCodesByTransaction(
		userId: number,
		tid: number
	): Promise<any> {
		let transaction = await this._tService.getUserCodesByTransaction(
			userId,
			tid
		);
		return transaction;
	}
	public async getAllCodesByTransaction(): Promise<any> {
		let transactions = await this._tService.getAllCodesByTransaction();
		return transactions;
	}
	public async getAllTransaction(): Promise<any[]> {
		let transactions = await this._tService.getAllTransaction();
		return transactions;
	}
	public async getSalesTransaction(): Promise<any[]> {
		let transactions = await this._tService.getSalesTransaction();
		return transactions;
	}

	public async getPurchaseTransaction(): Promise<any[]> {
		let transactions = await this._tService.getPurchaseTransaction();
		return transactions;
	}

	public async updateTransaction(tid, operation) {
		if (operation === "approve") {
			// console.log("approve");
			return await this._tService.approveBitcoinTransaction(tid);
		} else if (operation === "decline") {
			// console.log("decline");
			return await this._tService.declineBitcoinTransaction(tid);
		}
	}

	/**
	 * Method for Bank Account
	 * @param account: any
	 */
	public async saveAccount(account: any): Promise<any> {
		// console.log(account);
		if (account.id && account.id != "null") {
			// console.log("updating account");
			return await this._userService.updateAccount(account);
		} else {
			// console.log("creating account");
			return await this._userService.createAccount(account);
		}
	}

	public async getAccount(userId: number): Promise<any> {
		let account = await this._userService.getAccount(userId);
		console.log(account);
		return account;
	}

	/**
	 * Wallet Methods
	 */

	public async saveWallet(wallet: any): Promise<any> {
		// console.log(wallet);
		if (wallet.id && wallet.id != "null") {
			// console.log("updating wallet");
			return await this._userService.updateWallet(wallet);
		} else {
			// console.log("creating wallet");
			return await this._userService.createWallet(wallet);
		}
	}

	public async getWallet(userId: number): Promise<any> {
		return await this._userService.getWallet(userId);
	}

	/**
	 * Rate Methods
	 */
	public async getRateById(id: number): Promise<any> {
		return await this._rService.getRateById(id);
	}

	public async getAllRate(): Promise<any> {
		return await this._rService.getAllRate();
	}

	public async activateRate(id): Promise<any> {
		return await this._rService.activateRate(id);
	}

	public async deactiveRate(id): Promise<any> {
		return await this._rService.deactivateRate(id);
	}

	public async saveRate(payload): Promise<any> {
		if (payload && payload.id != 0) {
			console.log("update");
			return await this._rService.update(payload);
		}
		console.log("create");
		return await this._rService.create(payload);
	}

	public async removeRate(rateId: number): Promise<any> {
		await this._rService.removeRate(rateId);
		return "true";
	}

	public async getActiveRate(): Promise<any> {
		return await this._rService.getActiveRate();
	}

	/**
	 * Order Methods
	 */
	public async createOrder(orderPayload): Promise<any> {
		return await this._oService.scaffoldOrder(orderPayload);
	}

	public async toggleOrderStatus(orderId: number): Promise<any> {
		return await this._oService.setOrderProcessToTrue(orderId);
	}

	public async getOrderById(id: number): Promise<any> {
		return await this._oService.getById(id);
	}

	public async getAllOrder(): Promise<any> {
		return await this._oService.getAll();
	}

	public async processOrder(orderId: number, user: any): Promise<any> {
		return await this._oService.processOrder(orderId, user);
	}

	/**
	 * Order Item Methods
	 */
	public async create(orderItemPayload): Promise<any> {
		return await this._oItemService.create(orderItemPayload);
	}

	public async getOrderItemsByOrder(orderId: number): Promise<any> {
		return await this._oItemService.getOrderItemsByOrder(orderId);
	}

	/**
	 * Accounts
	 */
	public async forgotPassword(email: string, header: string): Promise<any> {
		return await this._accService.forgotPassword(email, header);
	}

	public async updateResetPassword(token: string, newPassword: string) {
		return await this._accService.updatePassword(token, newPassword);
	}

	public async confirmTokenValidity(token: string): Promise<any> {
		return await this._accService.checkTokenValidity(token);
	}

	public async sendToken(email: string, header: string): Promise<any> {
		return await this._accService.sendVerificationCode(email, header);
	}

	public async verifyUser(token: string): Promise<any> {
		return await this._accService.verifyAccount(token);
	}

	public async isEmailExist(email: string): Promise<boolean> {
		return await this._userService.isExist(email);
	}

	public async isPhoneExist(phone: any): Promise<boolean> {
		return await this._userService.getByPhone(phone);
	}

	public async isUserVerified(id: any): Promise<any> {
		return await this._userService.isVerified(id);
	}

	/**
	 * Bank Account and Wallet Methods
	 */
}
