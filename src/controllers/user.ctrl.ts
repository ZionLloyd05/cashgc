import { CartItem } from "./../models/CartItem";
import { User, IUserDTO } from "./../models/User";
import { UserService } from "./../services/user.service";
import { injectable, inject } from "inversify";
// import { EventEmitter } from "events";

@injectable()
export class UserController {
	private _userService: UserService;
	// private userEvent: EventEmitter;

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

	public async saveUser(user: User): Promise<IUserDTO> {
		if (user.id && user.id != null) {
			// update user logic
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
}
