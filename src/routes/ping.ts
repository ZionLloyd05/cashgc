import { AccountService } from "./../services/account.service";
import { OrderItemService } from "./../services/orderItem.service";
import { OrderService } from "./../services/order.service";
import { RateService } from "./../services/rate.service";
"use strict";
import { PaystackService } from "../services/paystack.service";
import { DatabaseProvider } from "./../database/index";
import { Transaction } from "./../models/Transaction";
import { GiftCodeService } from "./../services/gc.service";
import { UserService } from "./../services/user.service";
import { createQueryBuilder } from "typeorm";
import { CartItem } from "./../models/CartItem";
import { GiftCode } from "./../models/GiftCode";
import { GCCService } from "./../services/gcc.service";
import { GiftCodeCategory } from "./../models/GiftCodeCategory";
import { User } from "./../models/User";
// // Import only what we need from express
import { Router, Request, Response } from "express";
import { IRoute } from "./IRoute";
import DIContainer from "../container/DIContainer";
import { UserController } from "../controllers/user.ctrl";
import { inject } from "inversify";
import { TransactionService } from "../services/transaction.service";
import config from "../config";
import axios from "axios";
import * as _ from "underscore";
import { Order } from "./../models/Order";

export class PingRoute implements IRoute {
	private _userController: UserController = DIContainer.resolve<UserController>(
		UserController
	);
	private _userService: UserService = DIContainer.resolve<UserService>(
		UserService
	);
	private _gccService: GCCService = DIContainer.resolve<GCCService>(GCCService);

	private _gcService: GiftCodeService = DIContainer.resolve<GiftCodeService>(
		GiftCodeService
	);

	private _tService: TransactionService = DIContainer.resolve<
		TransactionService
	>(TransactionService);

	private _paystackService: PaystackService = DIContainer.resolve<
		PaystackService
	>(PaystackService);

	private _rService: RateService = DIContainer.resolve<RateService>(
		RateService
	);

	private _oService: OrderService = DIContainer.resolve<OrderService>(
		OrderService
	);

	private _oItemService: OrderItemService = DIContainer.resolve<
		OrderItemService
	>(OrderItemService);

	private _accService: AccountService = DIContainer.resolve<AccountService>(
		AccountService
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
		//   res.send("ok");

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
		// let uid = 2;
		// const citems = await createQueryBuilder("CartItem")
		// 	.innerJoinAndSelect(
		// 		"CartItem.giftCodeCategory",
		// 		"gcc",
		// 		"CartItem.giftCodeCategory = gcc.id"
		// 	)
		// 	.where("CartItem.user = :user", { user: uid })
		// 	.getMany();
		// let codes = await this._gcService.getUserCodes();
		// let gcodes = await createQueryBuilder("GiftCode")
		// 	.innerJoinAndSelect(
		// 		"GiftCode.transactions",
		// 		"gtrans",
		// 		"GiftCode.transactions = gtrans.id"
		// 	)
		// 	.getMany();
		// let db = await DatabaseProvider.getConnection();
		// var ress = await db
		// 	.createQueryBuilder()
		// 	.delete()
		// 	.from(CartItem)
		// 	.where("user", { user: 2 })
		// 	.execute();
		// let grepo = await db.getRepository("Transaction");
		// let transaction = await grepo.find({
		// 	relations: ["user"],
		// 	where: { "id": 2 }
		// });
		// await this._userService.removeFromCart(2, 2);
		// let trans = await this._tService.getUserTransaction(2);
		// let gc = await this._gcService.getGCbyCode("1G26bc4d5b045119b7dc72");
		// console.log(gc === undefined);
		// var gcodes = [
		// 	{
		// 	}
		// ];
		// var gfc = new GiftCode();
		// gfc.id = 91;
		// var gfc2 = new GiftCode();
		// gfc2.id = 85;
		// var payload: any = {
		// 	status: 0,
		// 	type: 0,
		// 	giftCodes: [gfc, gfc2]
		// };
		// var transaction = await this._tService.createTransaction(payload);
		// let account = {
		// 	name: "zenith",
		// 	number: 2100032257,
		// 	user: 2
		// };
		// let acc = await this._gcService.getGCbyCode("1A909b1ebf2c1d0c40e093");
		// res.send(acc);
		// fetch("https://api.paystack.co/bank", {
		// 	method: "GET",
		// 	headers: {
		// 		Authorization: `Bearer ${config.secret_key}`
		// 	}
		// })
		// 	.then(res => res.json())
		// 	.then(data => {
		// 		console.log(data);
		// 		res.send(data);
		// 	});
		// const header = `Authorization: Bearer ${config.secret_key}`;
		// await axios
		// 	.get("https://api.paystack.co/bank", {
		// 		headers: { header }
		// 	})
		// 	.then(response => {
		// 		let { data } = response;
		// 		// console.log(data);
		// 		let bnk = _.find(data.data, function(bank) {
		// 			if (bank.slug.includes("zenith")) {
		// 				console.log(bank);
		// 				return bank;
		// 			}
		// 		});
		// 		res.send(bnk);
		// 	});

		// let response = await this._paystackService.resolveAccount(
		// 	"2100032257",
		// 	"057"
		// );
		// let response = await this._userService.getAccount(20);

		// res.send(response);

		// let payload = {
		// 	type: "nuban",
		// 	name: "DAMILOLA ALAGBALA",
		// 	description: "Customer1029 bank account",
		// 	account_number: "2100032257",
		// 	bank_code: "057",
		// 	currency: "NGN",
		// }

		// let response = await this._paystackService.createReceipt(payload);

		// let payload = {
		// 	source: "balance",
		// 	amount: 4000000,
		// 	recipient: "RCP_tne6sw3tlaaqdgn"
		// }

		// let response = await this._paystackService.initiateTransfer(payload);
		let user = { id: 2 };
		// let response = await this._paystackService.makeTransfer(user, 4000);

		// console.log(response);
		// res.send(response);

		// let payload = { id: 1, localrate: 520 };
		// let payload2 = { id: 0, localrate: 500 };

		// let response = await this._userController.saveRate(payload);
		// let response2 = await this._userController.saveRate(payload2);

		// console.log(response);
		// console.log(response2);
		// res.send({ response, response2 });

		// let response = await this._rService.convertDollarToNaira(90);
		// let transaction = { id: 1 };
		// let payload = {
		// 	transaction
		// };
		// let imgUrl = "https://image.com/dami?id=3434";
		// // let imgUrl = '';

		// let response = await this._oService.create(payload, imgUrl);
		// let response = await this._oService.toggleOrderStatus(1);
		// let trans = { id: 6 };
		// let tPayload = {
		// 	trans		// };
		// let response = await this._oService.create(
		// 	tPayload,
		// 	"https://helloimg.com/234"
		// );

		// let gcc = new GiftCodeCategory();
		// gcc.id = 7;
		// let order = new Order();
		// order.id = 1;

		// let payload = {
		// 	giftCodeCategory: gcc,
		// 	order,
		// 	quantity: 3
		// };

		// let response = await this._oItemService.create(payload);

		// let response = await this._oItemService.getOrderItemsByOrder(1);

		// let userp = { id: 2 };
		// let payload = {
		// 	user: userp,
		// 	amount: 2000,
		// 	receiptPath: ""
		// };
		// let response = await this._oService.processOrder(7, userp);

		// let response = await this._userService.updatePassword("lishabi@gmail.com", "lisha123", "lisha111");
		// let email = "alagbaladamilola@gmail.com";
		// let header = "localhost:3000";
		// let token = "e552be23ad9196a5c146ef72f664b08fb9f0c8e9008a497434";
		// let pwd= 'Dami111';
		// let response = await this._accService.updatePassword(token, pwd);

		// let transaction = await this._tService.getUserTransactionsWithinLast24Hours(
		// 	2
		// );
		// let response = this._tService.totalAmountInTransactions(transaction);

		// let response = await this._tService.canMakeTransaction(4, 100);
		let response = await this._userService.getAll();
		console.log(response);
		// // res.send({ response });
		// console.log(response);
		// res.send({ response });
		res.send(response);
	}
}
