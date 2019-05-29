import { Admin } from "./../models/Admin";
import { CartItemService } from "./cartItem.service";
import { GCCService } from "./gcc.service";
import { DatabaseProvider } from "./../database/index";
import { User, IUserDTO } from "../models/User";
import * as crypto from "crypto";
import { injectable, inject } from "inversify";
import * as bcrypt from "bcryptjs";

@injectable()
export class UserService {
	private _gccService: GCCService;
	private _cartItemService: CartItemService;

	constructor(
		@inject(GCCService) private gccService: GCCService,
		@inject(CartItemService) private cartItemService: CartItemService
	) {
		this._gccService = gccService;
		this._cartItemService = cartItemService;
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

	public async addToCart(gccId: number, userId: number): Promise<boolean> {
		const gcccategory = await this._gccService.getById(gccId);
		const user = await this.getById(userId);
		return true;
		// if()
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
