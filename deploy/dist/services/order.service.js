"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const gc_service_1 = require("./gc.service");
const rate_service_1 = require("./rate.service");
const orderItem_service_1 = require("./orderItem.service");
const user_service_1 = require("./user.service");
const transaction_service_1 = require("./transaction.service");
const Order_1 = require("./../models/Order");
const index_1 = require("./../database/index");
const inversify_1 = require("inversify");
const cloudinary = require("cloudinary");
const config_1 = require("../config");
const DIContainer_1 = require("../container/DIContainer");
let OrderService = class OrderService {
    constructor() {
        this._tService = DIContainer_1.default.resolve(transaction_service_1.TransactionService);
        this._userService = DIContainer_1.default.resolve(user_service_1.UserService);
        this._rService = DIContainer_1.default.resolve(rate_service_1.RateService);
        this._gcService = DIContainer_1.default.resolve(gc_service_1.GiftCodeService);
        this._oItemService = DIContainer_1.default.resolve(orderItem_service_1.OrderItemService);
        this.cloudinary = cloudinary.config({
            cloud_name: config_1.default.cloudName,
            api_key: config_1.default.apiKey,
            api_secret: config_1.default.apiSecret
        });
    }
    create(orderPayload, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const orderRepo = db.getRepository(Order_1.Order);
            let newOrder = new Order_1.Order();
            console.log("here");
            if (filePath != null && filePath != "") {
                console.log("in");
                /**
                 * Wrap in a try catch so app doesn't crash
                 * when cloudinary service is temporarily down
                 */
                let receiptUrl;
                try {
                    receiptUrl = yield this.uploadImage(filePath);
                    console.log(receiptUrl);
                }
                catch (error) {
                    return error;
                }
                newOrder = Object.assign({}, orderPayload);
                newOrder.receiptUrl = receiptUrl;
                console.log(newOrder);
                return yield orderRepo.save(newOrder);
            }
            else {
                console.log("not in");
                let error = "Receipt of payment is required to create an order";
                return error;
            }
        });
    }
    scaffoldOrder(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // create transaction
            let amountInNaira = yield this._rService.convertDollarToNaira(payload.amount);
            console.log(amountInNaira);
            let transactionPayload = {
                status: 2,
                type: 0,
                payment: 3,
                amount: amountInNaira,
                user: payload.user
            };
            let newTransaction = yield this._tService.createTransaction(transactionPayload);
            // create order
            let orderPayload = {
                transaction: newTransaction
            };
            let newOrderResponse = yield this.create(orderPayload, payload.receiptPath);
            console.log(newOrderResponse);
            if (typeof newOrderResponse === "string") {
                return newOrderResponse;
            }
            // create order items
            // get current user cart item
            let currentUserCart = yield this._userService.getCartItem(payload.user);
            let { items } = currentUserCart;
            items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                let orderItemPayload = {
                    giftCodeCategory: item.giftCodeCategory,
                    order: newOrderResponse.id,
                    quantity: item.quantity
                };
                yield this._oItemService.create(orderItemPayload);
            }));
            // clear cart items
            yield this._userService.clearCart(payload.user.id);
            return "true";
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const orders = yield db
                .getRepository("order")
                .createQueryBuilder("order")
                .innerJoinAndSelect("order.transaction", "transaction")
                .innerJoinAndSelect("transaction.user", "user")
                .innerJoinAndSelect("order.orderItems", "orderItems")
                .innerJoinAndSelect("orderItems.giftCodeCategory", "giftCodeCategory")
                .where({ id: id })
                .getOne();
            return orders;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let orders = yield db
                .getRepository("order")
                .createQueryBuilder("order")
                .innerJoinAndSelect("order.transaction", "transaction")
                .innerJoinAndSelect("transaction.user", "user")
                .orderBy({
                "order.id": "DESC"
            })
                .getMany();
            return orders;
        });
    }
    setOrderProcessToTrue(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const orderRepo = db.getRepository(Order_1.Order);
            let orderInDb = yield this.getById(orderId);
            if (orderInDb.isProcessed == false)
                orderInDb.isProcessed = true;
            else
                return "Order has already been processed";
            return yield orderRepo.save(orderInDb);
        });
    }
    uploadImage(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cloudinary.uploader.upload(filePath);
            return result.secure_url;
        });
    }
    processOrder(orderId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // get order
            let order = yield this.getById(orderId);
            console.log(order.transaction.status);
            if (order.transaction.status != 1) {
                // set order isProcess == true
                let response = yield this.setOrderProcessToTrue(orderId);
                console.log(response);
                if (typeof response === "string") {
                    return response;
                }
                try {
                    // set transaction status == success
                    yield this._tService.setTransactionStatusToSuccess(order.transaction.id);
                    // generate codes
                    // get cart item
                    let cartItem = [];
                    let orderItem = yield this._oItemService.getOrderItemsByOrder(orderId);
                    let genCodes = yield this._gcService.generateCodes(orderItem);
                    yield this._tService.updateTransactionWithGcodes(genCodes, order.transaction.id);
                    let updatedOrder = yield this.getById(orderId);
                    return updatedOrder;
                }
                catch (error) {
                    return error;
                }
            }
            else {
                let error = "Transaction for this order has been declined";
                return error;
            }
        });
    }
    getAllPendingOrdersCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let orders = yield db
                .getRepository("order")
                .createQueryBuilder("order")
                .where("order.isProcessed = :status", { status: 0 })
                .orderBy({
                "order.id": "DESC"
            })
                .getMany();
            return orders.length;
        });
    }
};
OrderService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map