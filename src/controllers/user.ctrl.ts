import { CartService } from "./../services/cart.service";
import { IUserObserver } from "./../interfaces/IObserver";
import { ISubject } from "./../interfaces/ISubject";
import { User, IUserDTO } from "./../models/User";
import { UserService } from "./../services/user.service";
import { injectable, inject } from "inversify";

@injectable()
export class UserController implements ISubject {
  private _userService: UserService;

  @inject(CartService)
  private _cartService: CartService;
  //   private newUserId: number;
  private user: User;
  private observers: IUserObserver[] = [];

  constructor(@inject(UserService) userService: UserService) {
    this._userService = userService;
  }

  public async saveUser(user: User): Promise<IUserDTO> {
    if (user.id && user.id != null) {
      // update user logic
      return await this._userService.update(user);
    } else {
      // create user logic
      const newUser = await this._userService.create(user);
      this.user = newUser;
      this._cartService.Observe(this);
      this.notifyObserver();
    }
  }

  public async getUserById(id: number): Promise<IUserDTO> {
    return await this._userService.getById(id);
  }

  public async getAllUsers(): Promise<IUserDTO[]> {
    return await this._userService.getAll();
  }

  /**
   * Observers Preparation
   */
  registerObserver(o: IUserObserver) {
    this.observers.push(o);
  }
  removeObserver(o: IUserObserver) {
    let index = this.observers.indexOf(o);
    this.observers.splice(index, 1);
  }
  notifyObserver() {
    for (let observer of this.observers) {
      observer.userCreated(this.user);
    }
  }
}
