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
const index_1 = require("./../database/index");
const GiftCode_1 = require("./../models/GiftCode");
const crypto = require("crypto");
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const user_service_1 = require("./../services/user.service");
const DIContainer_1 = require("../container/DIContainer");
const transaction_service_1 = require("./../services/transaction.service");
const shared_service_1 = require("./../services/shared.service");
let GiftCodeService = class GiftCodeService {
    constructor() {
        /**
         *
         */
        this._userService = DIContainer_1.default.resolve(user_service_1.UserService);
        this._tService = DIContainer_1.default.resolve(transaction_service_1.TransactionService);
        this._sharedService = DIContainer_1.default.resolve(shared_service_1.SharedService);
        this.create = (code, gc) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const db = yield index_1.DatabaseProvider.getConnection();
                const gcRepo = db.getRepository('GiftCode');
                let newGc = new GiftCode_1.GiftCode();
                newGc.code = code;
                newGc.giftCodeCategory = gc;
                let createdGc = yield gcRepo.save(newGc);
                resolve(createdGc);
            }));
        };
        this.generateToken = () => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let db = yield index_1.DatabaseProvider.getConnection();
                let token = crypto.randomBytes(10).toString('hex');
                let gcInDb = yield db.getRepository('GiftCode').findOne({ code: token });
                if (gcInDb != undefined)
                    return this.generateToken();
                resolve(token);
            }));
        };
        this.generateCodes = (cartItem) => __awaiter(this, void 0, void 0, function* () {
            let generatedCodes = [];
            yield this.asyncForEach(cartItem, (item) => __awaiter(this, void 0, void 0, function* () {
                let quantity = item.quantity;
                let prefix = item.giftCodeCategory.prefix;
                let gc = item.giftCodeCategory;
                let itemArr = [];
                for (let x = 0; x < quantity; x++) {
                    let token = prefix + '' + (yield this.generateToken());
                    let giftCodeObj = yield this.create(token, gc);
                    let giftCode = giftCodeObj.code;
                    generatedCodes.push(giftCodeObj.id);
                }
            }));
            return generatedCodes;
        });
        this.getUserCodes = () => __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const gcRepo = db.getRepository('GiftCode');
            const citems = yield typeorm_1.createQueryBuilder('GiftCode')
                .innerJoinAndSelect('GiftCode.giftCodeCategory', 'gcc', 'GiftCode.giftCodeCategory = gcc.id')
                .getMany();
            return citems;
        });
        this.getCodeById = (id) => __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const gcRepository = yield db.getRepository(GiftCode_1.GiftCode);
            return yield gcRepository.findOne(id);
        });
        this.getAllCodes = () => __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const gcRepository = yield db.getRepository(GiftCode_1.GiftCode);
            return yield gcRepository.find();
        });
        this.getAllCodesCount = () => __awaiter(this, void 0, void 0, function* () {
            var codes = yield this.getAllCodes();
            return codes.length;
        });
        this.getGCbyCode = (token) => __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            console.log(token);
            let gcInDb = yield db.getRepository('GiftCode').findOne({
                relations: ['giftCodeCategory'],
                where: { code: token },
            });
            return gcInDb;
        });
        this.activateGiftCode = (code) => __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            if (code != null) {
                var gcode = yield this.getGCbyCode(code);
                if (gcode != null) {
                    gcode.isActivated = true;
                    return yield db.getRepository('GiftCode').save(gcode);
                }
            }
            return null;
        });
        this.deactivateGiftCode = (code) => __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            if (code != null) {
                var gcode = yield this.getGCbyCode(code);
                if (gcode != null) {
                    gcode.isActivated = false;
                    return yield db.getRepository('GiftCode').save(gcode);
                }
            }
            return null;
        });
        this.bulkActivation = (payload, operation) => __awaiter(this, void 0, void 0, function* () {
            var error = [];
            payload.forEach((code) => __awaiter(this, void 0, void 0, function* () {
                if (operation == 'activate') {
                    var updatedGC = yield this.activateGiftCode(code);
                    if (updatedGC != null) {
                        error.push('error in code');
                    }
                }
                else if (operation == 'deactivate') {
                    var updatedGC = yield this.deactivateGiftCode(code);
                    if (updatedGC != null) {
                        error.push('error in code');
                    }
                }
            }));
            return error;
        });
        // generateSingleCode = async (): Promise<any> => {
        // }
        // generateCodeByAdmin = async (user: any, codeLength: number): Promise<any> => {
        // 	if(codeLength != 0){
        // 	}
        // }
        this.scaffoldUserCode = (user, paymentId) => __awaiter(this, void 0, void 0, function* () {
            /**2.
             * scaffold the gift codes
             */
            //get current user cart item
            const itemBundle = yield this._userService.getCartItem(user);
            console.log('scaffolding user codes');
            const userCartItems = itemBundle.items;
            // scaffold codes
            const codes = yield this.generateCodes(userCartItems);
            let gcodes = codes;
            console.log(gcodes);
            // //save transaction(gcodes)
            let transactionPayload = {
                status: 0,
                type: 0,
                payment: 0,
                gcodes,
                paymentRef: paymentId,
                user,
                amount: itemBundle.totalPrice,
            };
            let transaction = yield this._tService.createTransaction(transactionPayload);
            // clear cart items
            const userId = user.id;
            yield this._userService.clearCart(userId);
            return transaction;
        });
        /**
         * asynchronous version for .forEach methos
         */
        this.asyncForEach = (array, callback) => __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < array.length; index++) {
                yield callback(array[index], index, array);
            }
        });
    }
};
GiftCodeService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], GiftCodeService);
exports.GiftCodeService = GiftCodeService;
//# sourceMappingURL=gc.service.js.map