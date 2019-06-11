import { createQueryBuilder } from "typeorm";
import { CartItem } from "./../models/CartItem";
import { Admin } from "./../models/Admin";
import { GCCService } from "./gcc.service";
import { DatabaseProvider } from "./../database/index";
import { User, IUserDTO } from "../models/User";
import * as crypto from "crypto";
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

	public async update(user: IUserDTO): Promise<IUserDTO> {
		const db = await DatabaseProvider.getConnection();
		const userRepository = db.getRepository(User);
		let userInDb = await userRepository.findOne(user.id);

		const { firstname, lastname, email, address, city, state, country } = user;
		userInDb.firstname = firstname;
		userInDb.lastname = lastname;
		userInDb.email = email;
		userInDb.address = address;
		userInDb.city = city;
		userInDb.state = state;
		userInDb.country = country;

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

	public async getByEmail(email: string): Promise<User> {
		const db = await DatabaseProvider.getConnection();

		const userRepository = await db.getRepository(User);
		const userInDb = await userRepository.findOne({ email: email });
		if (userInDb) return userInDb;
		else return null;
	}

	public async addToCart(
		gccId: number,
		userId: number,
		qty: number
	): Promise<any> {
		console.log("trying to add to cart");
		const db = await DatabaseProvider.getConnection();
		const cartRepo = db.getRepository(CartItem);

		const gcccategory = await this._gccService.getById(gccId);
		const user = await this.getById(userId);

		const cartItemInDb = await cartRepo.findOne({
			relations: ["giftCodeCategory"],
			where: { giftCodeCategory: gcccategory, user: user }
		});
		console.log(cartItemInDb);

		if (cartItemInDb && cartItemInDb != null) {
			console.log("found the cart item in db");
			cartItemInDb.quantity += qty;
			cartItemInDb.total += gcccategory.sellingPrice * qty;
			await cartRepo.save(cartItemInDb);
			// console.log(cartItemInDb)
			return cartItemInDb;
		}

		console.log("its a new item, adding a new row of item");
		let cartItem = new CartItem();
		cartItem.quantity = qty;
		cartItem.giftCodeCategory = gcccategory;
		cartItem.user = user;
		cartItem.total = gcccategory.sellingPrice * qty;

		await cartRepo.save(cartItem);
		return true;
	}

	public async removeFromCart(gccId: number, userId: number): Promise<any> {
		console.log("trying to remove to cart");
		console.log(gccId);
		console.log(userId);
		const db = await DatabaseProvider.getConnection();
		const cartRepo = db.getRepository(CartItem);

		const gcccategory = await this._gccService.getById(gccId);
		const user = await this.getById(userId);

		let cartItemInDb = await cartRepo.findOne({
			relations: ["giftCodeCategory"],
			where: { giftCodeCategory: gcccategory, user: user }
		});
		console.log(cartItemInDb);

		if (cartItemInDb && cartItemInDb != null) {
			cartItemInDb.quantity -= 1;
			cartItemInDb.total -= gcccategory.sellingPrice;
			if (cartItemInDb.quantity == 0) {
				console.log("removing entity");
				await cartRepo.remove(cartItemInDb);
				return null;
			}
			await cartRepo.save(cartItemInDb);
			return cartItemInDb;
		}
	}

	public async clearCart(userId: number) {
		console.log("clearing cart");
		const db = await DatabaseProvider.getConnection();
		try {
			await db
				.createQueryBuilder()
				.delete()
				.from(CartItem)
				.where("user", { user: userId })
				.execute();
		} catch (ex) {
			console.log(ex);
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

	public async isExist(email: string): Promise<boolean> {
		const user = await this.getByEmail(email);
		if (user) return true;
		else return false;
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
			}
		});
		let userDto: IUserDTO;
		userDto = { ...userFound };
		return userDto;
	}

	/**   *
	 * This is a helper function used for data encryption, password in this use case.
	 * @param data: string | number;
	 */
	private hashPassword(password: string): string {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
	}

	private comparePassword(password: string, hash: string): boolean {
		return bcrypt.compareSync(password, hash);
	}
}
