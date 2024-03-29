import { Wallet } from "./../models/Wallet";
import { BankAccount } from "../models/BankAccount";
import { CartItem } from "./../models/CartItem";
import { GCCService } from "./gcc.service";
import { DatabaseProvider } from "./../database/index";
import { User, IUserDTO } from "../models/User";
import { injectable, inject } from "inversify";
import * as bcrypt from "bcryptjs";

@injectable()
export class UserService {
	private _gccService: GCCService;

	constructor(@inject(GCCService) private gccService: GCCService) {
		this._gccService = gccService;
	}
	public async create(user: User): Promise<IUserDTO> {
		const db = await DatabaseProvider.getConnection();

		let newUser = new User();
		newUser = { ...user };

		newUser.password = this.hashPassword(user.password);
		//console.log(newUser);

		return await db.getRepository(User).save(newUser);
	}

	public async update(user: any): Promise<IUserDTO> {
		const db = await DatabaseProvider.getConnection();
		const userRepository = db.getRepository(User);

		let userInDb = await userRepository.findOne(user.id);

		const { firstname, lastname, email, phone, country } = user;
		userInDb.firstname = firstname;
		userInDb.lastname = lastname;
		userInDb.email = email;
		userInDb.country = country;
		userInDb.phone = phone;

		return await userRepository.save(userInDb);
	}

	public async getById(id: number): Promise<IUserDTO> {
		const db = await DatabaseProvider.getConnection();

		const userRepository = await db.getRepository(User);
		return userRepository.findOne(id);
	}

	public async getAll(): Promise<IUserDTO[]> {
		const db = await DatabaseProvider.getConnection();
		return await db.getRepository(User).find();
	}

	public async getAllUsersCount(): Promise<any> {
		var users = await this.getAll();
		return users.length;
	}

	public async getByEmail(email: string): Promise<User> {
		const db = await DatabaseProvider.getConnection();

		const userRepository = await db.getRepository(User);
		const userInDb = await userRepository.findOne({ email: email });
		if (userInDb) return userInDb;
		else return null;
	}

	public async isExist(email: string): Promise<boolean> {
		const user = await this.getByEmail(email);
		if (user) return true;
		else return false;
	}

	public async isVerified(id: number): Promise<any> {
		const user = await this.getById(id);

		if (user.isVerified) {
			return true;
		}

		return false;
	}

	public async togglePartnership(id: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		const userRepository = await db.getRepository(User);

		const user = await userRepository.findOne(id);

		if(user.isPartner === true) {
			user.isPartner = false;
		}
		else if(user.isPartner === false){
			user.isPartner = true;
		}

		return await userRepository.save(user);
	}

	public async isPhoneExist(phone: string): Promise<boolean> {
		const user = await this.getByPhone(phone);
		if (user) return true;
		else return false;
	}

	public async getByPhone(phone: any): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const userRepository = await db.getRepository("user");

		const userInDb = await userRepository
			.createQueryBuilder()
			.where("user.phone like :phonenumber", { phonenumber: "%" + phone + "%" })
			.getOne();

		if (userInDb) return userInDb;
		else return null;
	}

	public async addToCart(
		gccId: number,
		userId: number,
		qty: number
	): Promise<any> {
		// console.log("trying to add to cart");
		const db = await DatabaseProvider.getConnection();
		const cartRepo = db.getRepository(CartItem);

		const gcccategory = await this._gccService.getById(gccId);
		const user = await this.getById(userId);

		const cartItemInDb = await cartRepo.findOne({
			relations: ["giftCodeCategory"],
			where: { giftCodeCategory: gcccategory, user: user }
		});
		// console.log(cartItemInDb);

		if (cartItemInDb && cartItemInDb != null) {
			// console.log("found the cart item in db");
			cartItemInDb.quantity += qty;
			cartItemInDb.total += gcccategory.sellingPrice * qty;
			await cartRepo.save(cartItemInDb);
			// console.log(cartItemInDb)
			return cartItemInDb;
		}

		// console.log("its a new item, adding a new row of item");
		let cartItem = new CartItem();
		cartItem.quantity = qty;
		cartItem.giftCodeCategory = gcccategory;
		cartItem.user = user;
		cartItem.total = gcccategory.sellingPrice * qty;

		await cartRepo.save(cartItem);
		return true;
	}

	public async removeFromCart(gccId: number, userId: number): Promise<any> {
		// console.log("trying to remove to cart");
		// console.log(gccId);
		// console.log(userId);
		const db = await DatabaseProvider.getConnection();
		const cartRepo = db.getRepository(CartItem);

		const gcccategory = await this._gccService.getById(gccId);
		const user = await this.getById(userId);

		let cartItemInDb = await cartRepo.findOne({
			relations: ["giftCodeCategory"],
			where: { giftCodeCategory: gcccategory, user: user }
		});
		// console.log(cartItemInDb);

		if (cartItemInDb && cartItemInDb != null) {
			cartItemInDb.quantity -= 1;
			cartItemInDb.total -= gcccategory.sellingPrice;
			if (cartItemInDb.quantity == 0) {
				// console.log("removing entity");
				await cartRepo.remove(cartItemInDb);
				return null;
			}
			await cartRepo.save(cartItemInDb);
			return cartItemInDb;
		}
	}

	public async clearCart(userId: number) {
		// console.log("clearing cart");
		const db = await DatabaseProvider.getConnection();
		try {
			await db
				.createQueryBuilder()
				.delete()
				.from(CartItem)
				.where("user", { user: userId })
				.execute();
		} catch (ex) {
			// console.log(ex);
		}
	}

	public async getCartItem(user: IUserDTO): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		const itemRepo = await db.getRepository(CartItem);
		// const items = await itemRepo.find({ user: user});
		const items = await itemRepo
			.createQueryBuilder("CartItem")
			.innerJoinAndSelect(
				"CartItem.giftCodeCategory",
				"gcc",
				"CartItem.giftCodeCategory = gcc.id"
			)
			.where("CartItem.user = :user", { user: user.id })
			.getMany();

		let totalQuantity: number = 0;
		let totalPrice: number = 0;

		items.forEach(item => {
			totalQuantity += item.quantity;
			totalPrice += item.total;
		});

		let itemBundle = {
			items,
			totalQuantity,
			totalPrice
		};
		return itemBundle;
	}

	public async authenticate(
		email: string,
		password: string
	): Promise<IUserDTO> {
		let userFound: IUserDTO = null;
		await this.getByEmail(email).then(user => {
			if (user != null) {
				const isValid = this.comparePassword(password, user.password);
				if (isValid) {
					userFound = user;
				}
			} else {
				return null;
			}
		});
		let userDto: IUserDTO;
		userDto = { ...userFound };
		return userDto;
	}

	public async updatePassword(
		email: string,
		currentPassword: string,
		newPassword: string
	): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		let user = await this.authenticate(email, currentPassword);
		// console.log(user);
		if (Object.keys(user).length <= 0) {
			return "incorrect credentials";
		}

		let hashedPwd = this.hashPassword(newPassword);

		let updatedUser = new User();
		updatedUser = { ...user };
		updatedUser.password = hashedPwd;

		await db.getRepository(User).save(updatedUser);

		// console.log(updatedUser);

		return "updated";
	}

	public async createAccount(payload: any): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const accountRepo = await db.getRepository(BankAccount);

		let newbkAccount = await new BankAccount();
		
		newbkAccount.name = payload.name;
		newbkAccount.number = payload.number;
		newbkAccount.user = payload.user;

		return await accountRepo.save(newbkAccount);
	}

	/***
	 * Wallet Methods
	 */
	public async createWallet(payload: any): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const walletRepo = await db.getRepository(Wallet);

		let newWallet = await new Wallet();
		
		newWallet.wid = payload.wid;
		newWallet.user = payload.user;

		return await walletRepo.save(newWallet);
	}

	public async updateWallet(wallet: any): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const walletRepo = await db.getRepository(Wallet);

		let walletInDb = await walletRepo.findOne(wallet.id);

		const { wid } = wallet;

		walletInDb.wid = wid;

		return await walletRepo.save(walletInDb);
	}

	public async getWallet(userId: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const walletRepo = await db.getRepository(Wallet);

		const uwallet = await walletRepo.findOne({
			where: { user: userId }
		});

		// console.log(uwallet);

		return uwallet;
	}

	/**
	 * Bank Account Methods
	 */
	public async updateAccount(account: any): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const accountRepo = await db.getRepository(BankAccount);

		let accountInDb = await accountRepo.findOne(account.id);
		const { name, number } = account;

		accountInDb.name = name;
		accountInDb.number = number;

		let updated = await accountRepo.save(accountInDb);

		return updated;
	}

	public async getAccount(userId: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const accountRepo = await db.getRepository(BankAccount);

		return await accountRepo.findOne({
			where: { user: userId }
		});
	}

	public async getAdminAccount(): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		let adminAccount = await db
			.getRepository("bankaccount")
			.createQueryBuilder("bankaccount")
			.innerJoinAndSelect("bankaccount.user", "user")
			.innerJoinAndSelect("admin.user", "user")
			.getOne();

		return adminAccount;
	}

	/**   *
	 * This is a helper function used for data encryption, password in this use case.
	 * @param data: string | number;
	 */
	public hashPassword(password: string): string {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
	}

	private comparePassword(password: string, hash: string): boolean {
		return bcrypt.compareSync(password, hash);
	}
}
