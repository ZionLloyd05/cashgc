"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const OrderItem_1 = require("./../models/OrderItem");
const inversify_1 = require("inversify");
const index_1 = require("./../database/index");
let OrderItemService = class OrderItemService {
    create(orderItemPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const orderItemRepo = db.getRepository(OrderItem_1.OrderItem);
            let newOrderItem = new OrderItem_1.OrderItem();
            newOrderItem = Object.assign({}, orderItemPayload);
            return yield orderItemRepo.save(newOrderItem);
        });
    }
    getOrderItemsByOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let orderItems = yield db
                .getRepository(OrderItem_1.OrderItem)
                .createQueryBuilder("orderitem")
                .innerJoinAndSelect("orderitem.giftCodeCategory", "gcc", "orderitem.giftCodeCategory = gcc.id")
                .where({ order: orderId })
                .orderBy({
                "orderitem.id": "DESC"
            })
                .getMany();
            return orderItems;
        });
    }
};
OrderItemService = __decorate([
    inversify_1.injectable()
], OrderItemService);
exports.OrderItemService = OrderItemService;
//# sourceMappingURL=orderItem.service.js.map