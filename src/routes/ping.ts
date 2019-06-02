import { GiftCodeService } from "./../services/gc.service";
import { UserService } from "./../services/user.service";
import { createQueryBuilder } from "typeorm";
import { CartItem } from "./../models/CartItem";
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

	private _gcService: GiftCodeService = DIContainer.resolve<GiftCodeService>(
		GiftCodeService
	);

	initialize(router: Router): void {
		router.get("/ping", this.ping.bind(this));
	}

	/**
	 * Router Functions
	 */
	private async ping(req: Request, res: Response) {
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
		let uid = 2;
		const citems = await createQueryBuilder("CartItem")
			.innerJoinAndSelect(
				"CartItem.giftCodeCategory",
				"gcc",
				"CartItem.giftCodeCategory = gcc.id"
			)
			.where("CartItem.user = :user", { user: uid })
			.getMany();

		let codes = await this._gcService.generateCodes(citems);

		res.send(codes);
	}
}
