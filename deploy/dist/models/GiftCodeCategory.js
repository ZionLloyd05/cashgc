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
const OrderItem_1 = require("./OrderItem");
const GiftCode_1 = require("./GiftCode");
const CartItem_1 = require("./CartItem");
const typeorm_1 = require("typeorm");
let GiftCodeCategory = class GiftCodeCategory {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], GiftCodeCategory.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GiftCodeCategory.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        default: "https://res.cloudinary.com/decloud23tech/image/upload/v1559007371/placeholder.png"
    }),
    __metadata("design:type", String)
], GiftCodeCategory.prototype, "imageUrl", void 0);
__decorate([
    typeorm_1.Column("double"),
    __metadata("design:type", Number)
], GiftCodeCategory.prototype, "sellingPrice", void 0);
__decorate([
    typeorm_1.Column("double"),
    __metadata("design:type", Number)
], GiftCodeCategory.prototype, "buyingPrice", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GiftCodeCategory.prototype, "prefix", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], GiftCodeCategory.prototype, "isAvailable", void 0);
__decorate([
    typeorm_1.OneToMany(type => GiftCode_1.GiftCode, giftCode => giftCode.giftCodeCategory),
    __metadata("design:type", Array)
], GiftCodeCategory.prototype, "giftCodes", void 0);
__decorate([
    typeorm_1.OneToMany(type => OrderItem_1.OrderItem, orderItem => orderItem.giftCodeCategory),
    __metadata("design:type", Array)
], GiftCodeCategory.prototype, "orderItems", void 0);
__decorate([
    typeorm_1.OneToMany(type => CartItem_1.CartItem, cartItem => cartItem.giftCodeCategory),
    __metadata("design:type", Array)
], GiftCodeCategory.prototype, "cartItems", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], GiftCodeCategory.prototype, "createdAt", void 0);
GiftCodeCategory = __decorate([
    typeorm_1.Entity()
], GiftCodeCategory);
exports.GiftCodeCategory = GiftCodeCategory;
//# sourceMappingURL=GiftCodeCategory.js.map