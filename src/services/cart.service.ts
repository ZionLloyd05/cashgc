import { User } from "./../models/User";
import { IUserObserver } from "./../interfaces/IObserver";
import { DatabaseProvider } from "./../database/index";
import { injectable } from "inversify";
import { Cart } from "../models/Cart";

@injectable()
export class CartService implements IUserObserver {
  private async create(cart: Cart): Promise<Cart> {
    const db = await DatabaseProvider.getConnection();

    let newCart = new Cart();
    newCart = { ...cart };

    return await db.getRepository(Cart).save(newCart);
  }

  /**
   * On new user creation
   */

  async userCreated(user: User) {
    console.log("new user have been created, let set up a cart");
    let cart = new Cart();
    cart.user = user;
    this.create(cart)
      .then(cart => {
        console.log("Cart " + cart.id + " created for User " + cart.user.id);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
