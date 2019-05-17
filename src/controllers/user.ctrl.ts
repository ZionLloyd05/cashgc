import { CartService } from "./../services/cart.service";
import { IUserObserver } from "./../interfaces/IObserver";
import { ISubject } from "./../interfaces/ISubject";
import { User, IUserDTO } from "./../models/User";
import { UserService } from "./../services/user.service";
import { injectable, inject } from "inversify";
import { EventEmitter } from "events";

@injectable()
export class UserController {
  private _userService: UserService;
  private userEvent: EventEmitter;
  private _cartService: CartService;

  constructor(
    @inject(UserService) userService: UserService,
    @inject(CartService) cartService: CartService
  ) {
    /**
     * Declaring DIs */

    this._userService = userService;
    this._cartService = cartService;

    /**
     * Defining Events, on user creation
     */
    this.userEvent = new EventEmitter();
    this.userEvent.on("new user", user => this.setUpNewCart(user));
  }

  public async saveUser(user: User): Promise<IUserDTO> {
    if (user.id && user.id != null) {
      // update user logic
      return await this._userService.update(user);
    } else {
      // create user logic
      const newUser = await this._userService.create(user);
      this.userEvent.emit("new user", newUser);
      return newUser;
    }
  }

  public async getUserById(id: number): Promise<IUserDTO> {
    return await this._userService.getById(id);
  }

  public async getAllUsers(): Promise<IUserDTO[]> {
    return await this._userService.getAll();
  }

  private setUpNewCart(user) {
    this._cartService.createCart(user);
  }
}
