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
const GiftCodeCategory_1 = require("./GiftCodeCategory");
const typeorm_1 = require("typeorm");
let GiftCode = class GiftCode {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], GiftCode.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GiftCode.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], GiftCode.prototype, "isUsed", void 0);
__decorate([
    typeorm_1.Column({ default: "1990-10-10 10:00:00" }),
    __metadata("design:type", Date)
], GiftCode.prototype, "dateUsed", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], GiftCode.prototype, "isActivated", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Transaction_1.Transaction),
    __metadata("design:type", Array)
], GiftCode.prototype, "transactions", void 0);
__decorate([
    typeorm_1.ManyToOne(type => GiftCodeCategory_1.GiftCodeCategory, giftCodeCategory => giftCodeCategory.giftCodes),
    __metadata("design:type", GiftCodeCategory_1.GiftCodeCategory)
], GiftCode.prototype, "giftCodeCategory", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], GiftCode.prototype, "createdAt", void 0);
GiftCode = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(["code"])
], GiftCode);
exports.GiftCode = GiftCode;
//# sourceMappingURL=GiftCode.js.map