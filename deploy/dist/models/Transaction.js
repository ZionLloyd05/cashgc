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
const User_1 = require("./User");
const typeorm_1 = require("typeorm");
const GiftCode_1 = require("./GiftCode");
var Status;
(function (Status) {
    Status[Status["Success"] = 0] = "Success";
    Status[Status["Failed"] = 1] = "Failed";
    Status[Status["Pending"] = 2] = "Pending";
})(Status || (Status = {}));
var Type;
(function (Type) {
    Type[Type["Buy"] = 0] = "Buy";
    Type[Type["Sell"] = 1] = "Sell";
})(Type || (Type = {}));
var Payment;
(function (Payment) {
    Payment[Payment["Paypal"] = 0] = "Paypal";
    Payment[Payment["Paystack"] = 1] = "Paystack";
    Payment[Payment["Bitcoin"] = 2] = "Bitcoin";
    Payment[Payment["Bank"] = 3] = "Bank";
    Payment[Payment["Manual"] = 4] = "Manual";
    Payment[Payment["FlutterWave"] = 5] = "FlutterWave";
})(Payment || (Payment = {}));
let Transaction = class Transaction {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.Generated("uuid"),
    __metadata("design:type", Number)
], Transaction.prototype, "reference", void 0);
__decorate([
    typeorm_1.Column("enum", { enum: Status }),
    __metadata("design:type", Number)
], Transaction.prototype, "status", void 0);
__decorate([
    typeorm_1.Column("enum", { enum: Payment }),
    __metadata("design:type", Number)
], Transaction.prototype, "payment", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.transactions),
    __metadata("design:type", User_1.User)
], Transaction.prototype, "user", void 0);
__decorate([
    typeorm_1.Column("enum", { enum: Type }),
    __metadata("design:type", Number)
], Transaction.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ default: "nil" }),
    __metadata("design:type", String)
], Transaction.prototype, "paymentRef", void 0);
__decorate([
    typeorm_1.Column({ default: "nil" }),
    __metadata("design:type", String)
], Transaction.prototype, "message", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    typeorm_1.ManyToMany((type) => GiftCode_1.GiftCode),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Transaction.prototype, "giftCodes", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
Transaction = __decorate([
    typeorm_1.Entity()
], Transaction);
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map