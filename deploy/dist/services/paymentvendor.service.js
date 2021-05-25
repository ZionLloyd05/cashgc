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
const shared_service_1 = require("./shared.service");
const PaymentVendor_1 = require("../models/PaymentVendor");
const index_1 = require("../database/index");
const DIContainer_1 = require("../container/DIContainer");
const inversify_1 = require("inversify");
let PaymentVendorService = class PaymentVendorService {
    constructor() {
        this._sharedService = DIContainer_1.default.resolve(shared_service_1.SharedService);
    }
    // private async togglePayoutStatus(payoutId: number, slug: string) {
    // 	const db = await DatabaseProvider.getConnection();
    // 	const payoutRepo = db.getRepository(PayoutService);
    // }
    getPVendorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const pvRepo = yield db.getRepository(PaymentVendor_1.PaymentVendor);
            return yield pvRepo.findOne(id);
        });
    }
    createVendor(vendorPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let newPaymentVendor = new PaymentVendor_1.PaymentVendor();
            let { name, category, isAvailable, info } = vendorPayload;
            newPaymentVendor.name = name;
            newPaymentVendor.category = category;
            newPaymentVendor.info = info;
            newPaymentVendor.isAvailable = isAvailable;
            newPaymentVendor.slug = this.createSlug(name);
            return yield db.getRepository("PaymentVendor").save(newPaymentVendor);
        });
    }
    updateVendor(vendorPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const pvRepo = db.getRepository(PaymentVendor_1.PaymentVendor);
            let PaymentVendorInDb = yield this.getPVendorById(vendorPayload.id);
            let { name, category, isAvailable, info } = vendorPayload;
            PaymentVendorInDb.name = name;
            PaymentVendorInDb.info = info;
            PaymentVendorInDb.category = category;
            PaymentVendorInDb.isAvailable = isAvailable;
            return yield pvRepo.save(PaymentVendorInDb);
        });
    }
    removePaymentVendor(pvId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const pvRepo = db.getRepository(PaymentVendor_1.PaymentVendor);
            let PaymentVendorToRemove = yield this.getPVendorById(pvId);
            yield pvRepo.remove(PaymentVendorToRemove);
        });
    }
    getAllVendor() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const vendors = yield db
                .getRepository("PaymentVendor")
                .createQueryBuilder("PaymentVendor")
                .orderBy({
                "PaymentVendor.id": "DESC"
            })
                .getMany();
            // console.log(vendors)
            return vendors;
        });
    }
    getAllActiveVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let vendors = yield db
                .getRepository("PaymentVendor")
                .createQueryBuilder("PaymentVendor")
                .where({ isAvailable: true })
                .andWhere("PaymentVendor.category = :category")
                .setParameters({ category: "Manual" })
                .orderBy({
                "PaymentVendor.id": "DESC"
            })
                .getMany();
            return vendors;
        });
    }
    createSlug(vendorName) {
        var sub = vendorName.substring(0, 3).toLowerCase();
        var tok = this._sharedService.generateToken(3);
        return sub + "_" + tok;
    }
};
PaymentVendorService = __decorate([
    inversify_1.injectable()
], PaymentVendorService);
exports.PaymentVendorService = PaymentVendorService;
//# sourceMappingURL=paymentvendor.service.js.map