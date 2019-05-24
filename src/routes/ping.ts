import { UserService } from "./../services/user.service";
import { createQueryBuilder } from "typeorm";
import { CartItem } from "./../models/CartItem";
import { CartItemService } from "./../services/cartItem.service";
import { GCCService } from "./../services/gcc.service";
import { GiftCodeCategory } from "./../models/GiftCodeCategory";
import { User } from "./../models/User";
// // Import only what we need from express
import { Router, Request, Response } from "express";
import { IRoute } from "./IRoute";
import DIContainer from "../container/DIContainer";
import { UserController } from "../controllers/user.ctrl";
import { inject } from "inversify";

export class PingRoute implements IRoute {
  // private _userController: UserController = DIContainer.resolve<UserController>(
  //   UserController
  // );
  private _userService: UserService = DIContainer.resolve<UserService>(
    UserService
  );
  private _gccService: GCCService = DIContainer.resolve<GCCService>(GCCService);
  private _cartItemService: CartItemService = DIContainer.resolve<
    CartItemService
  >(CartItemService);

  initialize(router: Router): void {
    router.get("/ping", this.ping.bind(this));
  }

  /**
   * Router Functions
   */
  private async ping(req: Request, res: Response) {
    // res.json("GET:  Ok 200");
    // let nuser = new User();
    // nuser = {
    //   firstname: "shilo",
    //   lastname: "Leke",
    //   email: "shilolee@gmail.com",
    //   address: "las vegas",
    //   city: "juventus",
    //   state: "spain",
    //   country: "america",
    //   password: "lisha123"
    // };
    // let newGc = new GiftCodeCategory();
    // newGc = {
    //   title: "5",
    //   imageUrl: "blahblah",
    //   sellingPrice: 120,
    //   buyingPrice: 100,
    //   prefix: "1A"
    // };
    // let user = await this._userController.getUserById(1);
    // let gccc = await this._gccService.getById(1);

    // let newCartItem = new CartItem();
    // newCartItem = {
    //   quantity: 1,
    //   total: 200,
    //   giftCodeCategory: gccc,
    //   user: user
    // };

    // nuser = { ...req };
    // try {
    //   // await userService.update(nuser);

    // this._userService
    //   .create(nuser)
    //   .then(user => res.send(user))
    //   .catch(error => res.send(error));
    //   // this._gccService.create(newGc)
    //   // this._cartItemService.create(newCartItem)
    //   const citem = await createQueryBuilder("CartItem")
    //     .innerJoinAndSelect(
    //       "CartItem.giftCodeCategory",
    //       "gcc",
    //       "gcc.id = :id",
    //       { id: 1 }
    //     )
    //     .innerJoinAndSelect("CartItem.user", "user", "user.id = :id", { id: 2 })
    //     .getOne();
    //   res.send(citem);
    //   console.log(citem);
    //   // res.send("ok");
    // } catch (error) {
    //   console.log(error);
    // }
    // res.render("admin/index", {
    //   title: "Dashboard",
    //   layout: "adminLayout"
    // });
    // let email = "shilolee@gmail.com";
    // let pwd = "lisha1";
    // this._userService
    //   .isExist(email)
    //   .then(result => {
    //     console.log(result);
    //     res.send("ye");
    //   })
    //   .catch(error => res.send(error));
  }
}
