"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_service_1 = require("./../services/account.service");
const orderItem_service_1 = require("./../services/orderItem.service");
const order_service_1 = require("./../services/order.service");
const rate_service_1 = require("./../services/rate.service");
"use strict";
const paystack_service_1 = require("../services/paystack.service");
const gc_service_1 = require("./../services/gc.service");
const user_service_1 = require("./../services/user.service");
const paymentvendor_service_1 = require("../services/paymentvendor.service");
const gcc_service_1 = require("./../services/gcc.service");
const DIContainer_1 = require("../container/DIContainer");
const user_ctrl_1 = require("../controllers/user.ctrl");
const transaction_service_1 = require("../services/transaction.service");
class PingRoute {
    constructor() {
        this._userController = DIContainer_1.default.resolve(user_ctrl_1.UserController);
        this._userService = DIContainer_1.default.resolve(user_service_1.UserService);
        this._gccService = DIContainer_1.default.resolve(gcc_service_1.GCCService);
        this._gcService = DIContainer_1.default.resolve(gc_service_1.GiftCodeService);
        this._tService = DIContainer_1.default.resolve(transaction_service_1.TransactionService);
        this._paystackService = DIContainer_1.default.resolve(paystack_service_1.PaystackService);
        this._rService = DIContainer_1.default.resolve(rate_service_1.RateService);
        this._oService = DIContainer_1.default.resolve(order_service_1.OrderService);
        this._oItemService = DIContainer_1.default.resolve(orderItem_service_1.OrderItemService);
        this._accService = DIContainer_1.default.resolve(account_service_1.AccountService);
        this._payoutvendorService = DIContainer_1.default.resolve(paymentvendor_service_1.PaymentVendorService);
    }
    initialize(router) {
        router.get("/ping", this.ping.bind(this));
    }
    /**
     * Router Functions
     */
    ping(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            // let response = await this._userService.getAll();
            // let response = await this._tService.getUserTransactions(2);
            // let response = await this._paystackService.resolveAccount(
            // 	"0258999609",
            // 	"058"
            // );
            var payload = [2, 3, 4, 5];
            let response = yield this._userController.sendMetrics();
            // console.log(response);
            // console.log("hhgh");
            // // res.send({ response });
            // res.send({ response });
            // if (typeof response == "string") {
            // 	res.send({ response });
            // 	return;
            // }
            // console.log(response.data);
            // response.data && console.log(response.data.status);
            res.send(response);
        });
    }
}
exports.PingRoute = PingRoute;
//# sourceMappingURL=ping.js.map