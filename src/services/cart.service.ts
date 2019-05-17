import { ISubject } from "./../interfaces/ISubject";
import { UserController } from "./../controllers/user.ctrl";
import { User } from "./../models/User";
import { IUserObserver } from "./../interfaces/IObserver";
import { DatabaseProvider } from "./../database/index";
import { injectable, inject } from "inversify";
import { Cart } from "../models/Cart";

@injectable()
export class CartService {
  public async createCart(user: User): Promise<Cart> {
    console.log("setting up a cart for " + user.firstname);
    const db = await DatabaseProvider.getConnection();

    let newCart = new Cart();
    newCart.user = user;

    return await db.getRepository(Cart).save(newCart);
  }
}
