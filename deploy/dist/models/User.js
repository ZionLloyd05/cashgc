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
const CartItem_1 = require("./CartItem");
const Transaction_1 = require("./Transaction");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Min(3),
    class_validator_1.Max(30),
    __metadata("design:type", String)
], User.prototype, "firstname", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Min(3),
    class_validator_1.Max(30),
    __metadata("design:type", String)
], User.prototype, "lastname", void 0);
__decorate([
    typeorm_1.Column({
        unique: true
    }),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Max(20),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isPartner", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ default: "nil" }),
    __metadata("design:type", String)
], User.prototype, "utoken", void 0);
__decorate([
    typeorm_1.Column({ default: "1990-10-10 10:00:00" }),
    __metadata("design:type", Date)
], User.prototype, "uTokenExpiryDate", void 0);
__decorate([
    typeorm_1.OneToMany(() => CartItem_1.CartItem, cartItem => cartItem.user),
    __metadata("design:type", Array)
], User.prototype, "cartItems", void 0);
__decorate([
    typeorm_1.OneToMany(() => Transaction_1.Transaction, transaction => transaction.user),
    __metadata("design:type", Array)
], User.prototype, "transactions", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map