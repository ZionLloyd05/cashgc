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

	constructor(@inject(UserService) userService: UserService) {
		/**
		 * Declaring DIs */

		this._userService = userService;

		/**
		 * Defining Events, on user creation
		 */
		// this.userEvent = new EventEmitter();
		// this.userEvent.on("new user", user => this.setUpNewCart(user));
	}

	public async saveUser(user: any): Promise<IUserDTO> {
		if (user.id && user.id != null) {
			// update user logic
			console.log("updating user");
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
		return await this._userService.getAll();
	}
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
	public async scaffoldCodes(cartItem: any): Promise<any> {
		let codes = await this._gcService.generateCodes(cartItem);
		return codes;
	}
	public async getUserCodes(): Promise<any> {
		let codes = await this._gcService.getUserCodes();
		return codes;
	}
	public async createTransaction(payload: any): Promise<any> {
		let transaction = await this._tService.createTransaction(payload);
		return transaction;
	}
	public async getUserTransaction(userId: number): Promise<any> {
		let transactions = await this._tService.getUserTransaction(userId);
		return transactions;
	}
	public async getGCbyCode(code: string): Promise<any> {
		let gcInDb = await this._gcService.getGCbyCode(code);
		return gcInDb;
	}
	public async removeFromCart(gccId: number, userId: number): Promise<any> {
		return await this._userService.removeFromCart(gccId, userId);
	}
	/**
	 * Method for Bank Account
	 * @param account: any
	 */
	public async saveAccount(account: any): Promise<any> {
		// console.log(account);
		if (account.id && account.id != "null") {
			console.log("updating account");
			return await this._userService.updateAccount(account);
		} else {
			console.log("creating account");
			return await this._userService.createAccount(account);
		}
	}

	public async getAccount(userId: number): Promise<any> {
		return this._userService.getAccount(userId);
	}

	public async saveWallet(wallet: any): Promise<any> {
		// console.log(wallet);
		if (wallet.id && wallet.id != "null") {
			console.log("updating wallet");
			return await this._userService.updateWallet(wallet);
		} else {
			console.log("creating wallet");
			return await this._userService.createWallet(wallet);
		}
	}

	public async getWallet(userId: number): Promise<any> {
		return this._userService.getWallet(userId);
	}

	public async createPendingCodes(payload: any): Promise<any> {
		return this._userService.createPendingCode(payload);
	}
}
