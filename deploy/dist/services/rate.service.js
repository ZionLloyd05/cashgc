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
const typeorm_1 = require("typeorm");
const Rate_1 = require("./../models/Rate");
const index_1 = require("./../database/index");
const inversify_1 = require("inversify");
let RateService = class RateService {
    create(ratePayload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(ratePayload);
            const db = yield index_1.DatabaseProvider.getConnection();
            let { localrate } = ratePayload;
            let newRate = new Rate_1.Rate();
            newRate.localrate = localrate;
            newRate.isactive = false;
            console.log(newRate);
            return yield db.getRepository(Rate_1.Rate).save(newRate);
        });
    }
    update(ratePayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const rateRepo = db.getRepository(Rate_1.Rate);
            let rateInDb = yield this.getRateById(ratePayload.id);
            let { localrate } = ratePayload;
            rateInDb.localrate = localrate;
            return yield rateRepo.save(rateInDb);
        });
    }
    getAllRate() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            return yield db
                .getRepository('rate')
                .createQueryBuilder('rate')
                .orderBy({
                'rate.id': 'DESC',
            })
                .getMany();
        });
    }
    getRateById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const rateRepo = yield db.getRepository(Rate_1.Rate);
            return yield rateRepo.findOne(id);
        });
    }
    getActiveRate() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const rateRepo = db.getRepository(Rate_1.Rate);
            return yield typeorm_1.createQueryBuilder('Rate')
                .where('Rate.isactive = :isactive', { isactive: true })
                .getOne();
        });
    }
    activateRate(rateId) {
        return __awaiter(this, void 0, void 0, function* () {
            let error;
            const db = yield index_1.DatabaseProvider.getConnection();
            const rateRepo = db.getRepository(Rate_1.Rate);
            let activeRate = yield this.getActiveRate();
            if (activeRate && Object.keys(activeRate).length > 0) {
                error = 'Cannot have double activated rates';
                return error;
            }
            let rateInDb = yield this.getRateById(rateId);
            rateInDb.isactive = true;
            return yield rateRepo.save(rateInDb);
        });
    }
    deactivateRate(rateId) {
        return __awaiter(this, void 0, void 0, function* () {
            let error;
            const db = yield index_1.DatabaseProvider.getConnection();
            const rateRepo = db.getRepository(Rate_1.Rate);
            let rateInDb = yield this.getRateById(rateId);
            rateInDb.isactive = false;
            return yield rateRepo.save(rateInDb);
        });
    }
    removeRate(rateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const rateRepo = db.getRepository(Rate_1.Rate);
            let rateToRemove = yield this.getRateById(rateId);
            yield rateRepo.remove(rateToRemove);
        });
    }
    convertDollarToNaira(amountInDollar) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getActiveRate();
            let { localrate } = response;
            return amountInDollar * localrate;
        });
    }
};
RateService = __decorate([
    inversify_1.injectable()
], RateService);
exports.RateService = RateService;
//# sourceMappingURL=rate.service.js.map