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
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./Transaction");
const OrderItem_1 = require("./OrderItem");
const typeorm_1 = require("typeorm");
let Order = class Order {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Order.prototype, "receiptUrl", void 0);
__decorate([
    typeorm_1.Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Order.prototype, "isProcessed", void 0);
__decorate([
    typeorm_1.OneToOne(() => Transaction_1.Transaction),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Transaction_1.Transaction)
], Order.prototype, "transaction", void 0);
__decorate([
    typeorm_1.OneToMany(type => OrderItem_1.OrderItem, orderItem => orderItem.order),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
Order = __decorate([
    typeorm_1.Entity()
], Order);
exports.Order = Order;
//# sourceMappingURL=Order.js.map