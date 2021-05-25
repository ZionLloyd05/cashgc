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
const inversify_1 = require("inversify");
const _ = require("underscore");
const axios_1 = require("axios");
const config_1 = require("../config");
const DIContainer_1 = require("../container/DIContainer");
const gc_service_1 = require("./../services/gc.service");
const user_service_1 = require("./user.service");
const rate_service_1 = require("./rate.service");
const transaction_service_1 = require("./transaction.service");
let PaymentService = class PaymentService {
    constructor() {
        this._gcService = DIContainer_1.default.resolve(gc_service_1.GiftCodeService);
        this._userService = DIContainer_1.default.resolve(user_service_1.UserService);
        this._rService = DIContainer_1.default.resolve(rate_service_1.RateService);
        this._tService = DIContainer_1.default.resolve(transaction_service_1.TransactionService);
        this.baseUrl = 'https://api.flutterwave.com/v3';
        this.errors = [];
    }
    handleUserOrder(user, transactionReference) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('handling request');
            console.log(transactionReference);
            try {
                return yield this._gcService.scaffoldUserCode(user, transactionReference);
            }
            catch (error) {
                console.error(error);
                return 'error';
            }
        });
    }
    makeTransfer(user, amountToTransfer, codesToSell) {
        return __awaiter(this, void 0, void 0, function* () {
            let error = '';
            console.log('making transfer initiated');
            // collect user account details
            let userAccount = yield this._userService.getAccount(user.id);
            console.log(userAccount);
            if (userAccount && Object.keys(userAccount).length > 0) {
                console.log('trying to fetch data');
                // get bank code
                let bankcode = yield this.fetchBankCode(userAccount.name);
                let amountToTransferInNaira = yield this._rService.convertDollarToNaira(amountToTransfer);
                console.log('in maketransfer');
                const { v4: uuidv4 } = require('uuid');
                var transactionRef = uuidv4();
                var transferPayload = {
                    account_bank: bankcode,
                    account_number: userAccount.number,
                    amount: amountToTransferInNaira,
                    narration: 'Payment for codes',
                    currency: 'NGN',
                    beneficiary_name: `${user.firstname} ${user.lastname}`,
                    callback_url: 'https://cashgiftcode.com/user/transfer-callback',
                };
                console.log(transferPayload);
                const res = yield axios_1.default({
                    method: 'post',
                    url: `${this.baseUrl}/transfers`,
                    data: transferPayload,
                    headers: {
                        Authorization: `Bearer ${config_1.default.secret_key}`,
                    },
                }).catch(function (error) {
                    let toReturn = { status: 'failed', data: error };
                    return toReturn;
                });
                console.log('got here');
                var response = res.data;
                console.log(response);
                if (response.status == 'success') {
                    // save transaction
                    let transactionPayload = {
                        status: 2,
                        type: 1,
                        payment: 5,
                        user,
                        paymentRef: response.data.reference,
                        amount: response.data.amount,
                        gcodes: codesToSell,
                    };
                    yield this._tService.createTransaction(transactionPayload);
                    let toReturn = { status: 'success', data: response };
                    console.log(toReturn);
                    return toReturn;
                }
            }
            else {
                error = 'Incorrect account credentials';
                let toReturn = { status: 'failed', data: error };
                return toReturn;
            }
        });
    }
    handleTransferCallback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log('holla');
            console.log(payload);
            if (payload == null) {
                return false;
            }
            //get transaction by reference
            let transactionInDb = yield this._tService.getTransactionByReference(payload.reference);
            console.log(transactionInDb);
            if (payload.status == 'FAILED') {
                //get transaction
                transactionInDb.message = payload.complete_message;
                console.log(transactionInDb);
                //update transaction status
                yield this._tService.updateTransfer(transactionInDb);
            }
            else if (payload.status == 'SUCCESS') {
                transactionInDb.status = 0;
                console.log(transactionInDb);
                yield this._tService.updateTransfer(transactionInDb);
            }
            return;
        });
    }
    resolveAccount(accnumber, bankcode) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('resolving account');
            let res_error = '';
            const res = yield axios_1.default({
                method: 'GET',
                responseType: 'json',
                url: `${this.baseUrl}/bank/resolve?account_number=${accnumber}&bank_code=${bankcode}`,
                headers: {
                    Authorization: 'Bearer ' + config_1.default.secret_key,
                },
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    res_error = 'Incorrect account credentials';
                }
                else if (error.request) {
                    res_error = 'No internet connection';
                }
                else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    res_error = error.message;
                }
            });
            res_error && console.log(res_error);
            if (res_error == '')
                return res;
            else
                return res_error;
        });
    }
    fetchBankCode(bankname) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('fetching bank codes');
            console.log(config_1.default.secret_key);
            let banks;
            let response = yield axios_1.default.get(`${this.baseUrl}/banks/NG`, {
                headers: {
                    Authorization: `Bearer ${config_1.default.secret_key}`,
                    'Access-Control-Allow-Origin': '*',
                },
            });
            banks = response.data.data;
            let bank = _.find(banks, function (bank) {
                if (bank.name.includes(bankname)) {
                    return bank;
                }
            });
            return bank.code;
        });
    }
};
PaymentService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map