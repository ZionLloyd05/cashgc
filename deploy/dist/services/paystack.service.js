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
const rate_service_1 = require("./rate.service");
const transaction_service_1 = require("./transaction.service");
const user_service_1 = require("./user.service");
const inversify_1 = require("inversify");
const config_1 = require("../config");
const axios_1 = require("axios");
const _ = require("underscore");
const DIContainer_1 = require("../container/DIContainer");
let PaystackService = class PaystackService {
    constructor() {
        this._userService = DIContainer_1.default.resolve(user_service_1.UserService);
        this._tService = DIContainer_1.default.resolve(transaction_service_1.TransactionService);
        this._rService = DIContainer_1.default.resolve(rate_service_1.RateService);
        this.baseUrl = "https://api.paystack.co";
        this.errors = [];
    }
    fetchBanks() {
        return __awaiter(this, void 0, void 0, function* () {
            let banks;
            const header = `Authorization: Bearer ${config_1.default.secret_key}`;
            let response = yield axios_1.default.get(`${this.baseUrl}/bank`, {
                headers: { header },
            });
            banks = response.data.data;
            return banks;
        });
    }
    fetchBankCode(bankname) {
        return __awaiter(this, void 0, void 0, function* () {
            let banks;
            const header = `Authorization: Bearer ${config_1.default.secret_key}`;
            let response = yield axios_1.default.get(`${this.baseUrl}/bank`, {
                headers: { header },
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
    resolveAccount(accnumber, bankcode) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(config.secret_key);
            // console.log(accnumber + " " + bankcode);
            let res_error = "";
            const res = yield axios_1.default({
                method: "GET",
                responseType: "json",
                url: `${this.baseUrl}/bank/resolve?account_number=${accnumber}&bank_code=${bankcode}`,
                headers: {
                    Authorization: "Bearer " + config_1.default.secret_key,
                },
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    res_error = "Incorrect account credentials";
                }
                else if (error.request) {
                    res_error = "No internet connection";
                }
                else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                    res_error = error.message;
                }
            });
            res_error && console.log(res_error);
            if (res_error == "")
                return res;
            else
                return res_error;
        });
    }
    // 	"type": "nuban",
    //    "name": "Account 10
    // sfgdfgdf29",dldglsdfksfk
    //    "description": "Customer1029 bank account",
    //    "account_number": "01000000010",
    //    "bank_code": "044",
    //    "currency": "NGN",
    createReceipt(accPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(config_1.default.secret_key);
            const res = yield axios_1.default.post(`${this.baseUrl}/transferrecipient`, accPayload, {
                headers: { Authorization: "Bearer " + config_1.default.secret_key },
            });
            return res.data;
        });
    }
    // {"source": "balance", "reason": "Holiday Flexing", "amount":3794800, "recipient": "RCP_gx2wn530m0i3w3m"}'
    initiateTransfer(transferPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            let res_error = "";
            const res = yield axios_1.default
                .post(`${this.baseUrl}/transfer`, transferPayload, {
                headers: { Authorization: "Bearer " + config_1.default.secret_key },
            })
                .catch(function (error) {
                if (error.response) {
                    console.log(error.response);
                    res_error = "Your balance is not enough to fulfil this request";
                }
                else if (error.request) {
                    res_error = "No internet connection";
                    console.log(error.request);
                    return error.request;
                }
                else {
                    // Somethingaskjdkj happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
            });
            res_error && console.log(res_error);
            if (res_error == "")
                return res.data;
            else
                return res_error;
        });
    }
    nairaToKobo(amountInNaira) {
        return amountInNaira * 100;
    }
    log(message) {
        console.log(message);
    }
    makeTransfer(user, amountToTransfer, codesToSell) {
        return __awaiter(this, void 0, void 0, function* () {
            let error = "";
            // collect user account details
            let userAccount = yield this._userService.getAccount(user.id);
            this.log(userAccount);
            if (userAccount && Object.keys(userAccount).length > 0) {
                // get bank code
                let bankcode = yield this.fetchBankCode(userAccount.name);
                this.log(bankcode);
                // verify user's account a.k.a resolving account
                let resolveResponse = yield this.resolveAccount(userAccount.number, bankcode);
                if (typeof resolveResponse == "string") {
                    error = "Incorrect account credentials";
                    return { status: "failed", data: error };
                }
                // this.log(resolveResponse);
                if (resolveResponse.data && resolveResponse.data.status == true) {
                    let { account_name, account_number } = resolveResponse.data.data;
                    // create a transfer reciept
                    let recieptPayload = {
                        type: "nuban",
                        name: account_name,
                        account_number: account_number,
                        bank_code: bankcode,
                        currency: "NGN",
                    };
                    let recieptResponse = yield this.createReceipt(recieptPayload);
                    this.log(recieptResponse);
                    if (recieptResponse.status && recieptResponse.status == true) {
                        // initiate a transfer
                        let amountToTransferInNaira = yield this._rService.convertDollarToNaira(amountToTransfer);
                        let amountInKobo = this.nairaToKobo(amountToTransferInNaira);
                        let transferPayload = {
                            source: "balance",
                            amount: amountInKobo,
                            recipient: recieptResponse.data.recipient_code,
                        };
                        console.log("about to initiate transfer");
                        let transferResponse = yield this.initiateTransfer(transferPayload);
                        if (typeof transferResponse == "string") {
                            error = "Kindly contact the admin";
                            return { status: "failed", data: error };
                        }
                        console.log("Transfer initiated");
                        if (transferResponse.status && transferResponse.status == true) {
                            let amountInNaira = yield this._rService.convertDollarToNaira(amountToTransfer);
                            // save transaction
                            let transactionPayload = {
                                status: 0,
                                type: 1,
                                payment: 1,
                                user,
                                paymentRef: transferResponse.data.transfer_code,
                                amount: amountInNaira,
                                gcodes: codesToSell,
                            };
                            yield this._tService.createTransaction(transactionPayload);
                            return { status: "success", data: transferResponse };
                        }
                    }
                    else {
                        error = "Unable to create transfer reciept";
                        return { status: "failed", data: error };
                    }
                }
                else {
                    error = "Incorrect account credentials";
                    return { status: "failed", data: error };
                }
            }
            else {
                error = "No account for user";
                return { status: "failed", data: error };
            }
        });
    }
};
PaystackService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], PaystackService);
exports.PaystackService = PaystackService;
//# sourceMappingURL=paystack.service.js.map