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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const paymentvendor_service_1 = require("../services/paymentvendor.service");
const account_service_1 = require("./../services/account.service");
const orderItem_service_1 = require("./../services/orderItem.service");
const order_service_1 = require("./../services/order.service");
const rate_service_1 = require("./../services/rate.service");
const transaction_service_1 = require("./../services/transaction.service");
const user_service_1 = require("./../services/user.service");
const inversify_1 = require("inversify");
const gc_service_1 = require("./../services/gc.service");
const DIContainer_1 = require("../container/DIContainer");
// import { EventEmitter } from "events";
let UserController = class UserController {
    constructor(userService) {
        this._gcService = DIContainer_1.default.resolve(gc_service_1.GiftCodeService);
        this._tService = DIContainer_1.default.resolve(transaction_service_1.TransactionService);
        this._rService = DIContainer_1.default.resolve(rate_service_1.RateService);
        this._oService = DIContainer_1.default.resolve(order_service_1.OrderService);
        this._oItemService = DIContainer_1.default.resolve(orderItem_service_1.OrderItemService);
        this._accService = DIContainer_1.default.resolve(account_service_1.AccountService);
        this._payoutvendorService = DIContainer_1.default.resolve(paymentvendor_service_1.PaymentVendorService);
        this._userService = userService;
    }
    /**
     * User Methods
     */
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.id && user.id != null) {
                // update user logic
                // console.log("updating user");
                return yield this._userService.update(user);
            }
            else {
                // create user logic
                const newUser = yield this._userService.create(user);
                // this.userEvent.emit("new user", newUser);
                return newUser;
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userService.getById(id);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this._userService.getAll();
            return users;
        });
    }
    updatePassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentPassword, newPassword, email } = payload;
            return yield this._userService.updatePassword(email, currentPassword, newPassword);
        });
    }
    togglePartnership(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userService.togglePartnership(id);
        });
    }
    /**
     * Cart Methods
     */
    getCartItems(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userService.getCartItem(user);
        });
    }
    addToCart(gcId, userId, qty) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userService.addToCart(gcId, userId, qty);
        });
    }
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._userService.clearCart(userId);
        });
    }
    removeFromCart(gccId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userService.removeFromCart(gccId, userId);
        });
    }
    /**
     * Gift Code Methods
     */
    scaffoldCodes(cartItem) {
        return __awaiter(this, void 0, void 0, function* () {
            let codes = yield this._gcService.generateCodes(cartItem);
            return codes;
        });
    }
    getUserCodes() {
        return __awaiter(this, void 0, void 0, function* () {
            let codes = yield this._gcService.getUserCodes();
            return codes;
        });
    }
    getGCbyCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let gcInDb = yield this._gcService.getGCbyCode(code);
            return gcInDb;
        });
    }
    /**
     * Bulk action on gift codes
     */
    bulkAction(payload, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._gcService.bulkActivation(payload, operation);
        });
    }
    /**
     * Transaction Methods
     */
    createTransaction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield this._tService.createTransaction(payload);
            return transaction;
        });
    }
    getUserTransactions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactions = yield this._tService.getUserTransactions(userId);
            return transactions;
        });
    }
    getUserTransactionsAlone(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactions = yield this._tService.getUserTransactionsAlone(userId);
            return transactions;
        });
    }
    getUserCodesByTransaction(userId, tid) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield this._tService.getUserCodesByTransaction(userId, tid);
            return transaction;
        });
    }
    getAllCodesByTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            let transactions = yield this._tService.getAllCodesByTransaction();
            return transactions;
        });
    }
    getAllTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            let transactions = yield this._tService.getAllTransaction();
            return transactions;
        });
    }
    getSalesTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            let transactions = yield this._tService.getSalesTransaction();
            return transactions;
        });
    }
    getPurchaseTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            let transactions = yield this._tService.getPurchaseTransaction();
            return transactions;
        });
    }
    updateTransaction(tid, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(operation);
            if (operation === 'approve') {
                // console.log("approve");
                return yield this._tService.approveTransaction(tid);
            }
            else if (operation === 'decline') {
                // console.log("decline");
                return yield this._tService.declineTransaction(tid);
            }
        });
    }
    /**
     * Method for Bank Account
     * @param account: any
     */
    saveAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(account);
            if (account.id && account.id != 'null') {
                // console.log("updating account");
                return yield this._userService.updateAccount(account);
            }
            else {
                // console.log("creating account");
                return yield this._userService.createAccount(account);
            }
        });
    }
    getAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = yield this._userService.getAccount(userId);
            console.log(account);
            return account;
        });
    }
    /**
     * Wallet Methods
     */
    saveWallet(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(wallet);
            if (wallet.id && wallet.id != 'null') {
                // console.log("updating wallet");
                return yield this._userService.updateWallet(wallet);
            }
            else {
                // console.log("creating wallet");
                return yield this._userService.createWallet(wallet);
            }
        });
    }
    getWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userService.getWallet(userId);
        });
    }
    /**
     * Rate Methods
     */
    getRateById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._rService.getRateById(id);
        });
    }
    getAllRate() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._rService.getAllRate();
        });
    }
    activateRate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._rService.activateRate(id);
        });
    }
    deactiveRate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._rService.deactivateRate(id);
        });
    }
    saveRate(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload && payload.id != 0) {
                console.log('update');
                return yield this._rService.update(payload);
            }
            console.log('create');
            return yield this._rService.create(payload);
        });
    }
    removeRate(rateId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._rService.removeRate(rateId);
            return 'true';
        });
    }
    getActiveRate() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._rService.getActiveRate();
        });
    }
    /**
     * Order Methods
     */
    createOrder(orderPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._oService.scaffoldOrder(orderPayload);
        });
    }
    toggleOrderStatus(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._oService.setOrderProcessToTrue(orderId);
        });
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._oService.getById(id);
        });
    }
    getAllOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._oService.getAll();
        });
    }
    processOrder(orderId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._oService.processOrder(orderId, user);
        });
    }
    getAllPendingOrdersCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._oService.getAllPendingOrdersCount();
        });
    }
    /**
     * Order Item Methods
     */
    create(orderItemPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._oItemService.create(orderItemPayload);
        });
    }
    getOrderItemsByOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._oItemService.getOrderItemsByOrder(orderId);
        });
    }
    /**
     * Accounts
     */
    forgotPassword(email, header) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._accService.forgotPassword(email, header);
        });
    }
    updateResetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._accService.updatePassword(token, newPassword);
        });
    }
    confirmTokenValidity(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._accService.checkTokenValidity(token);
        });
    }
    sendToken(email, header) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._accService.sendVerificationCode(email, header);
        });
    }
    verifyUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._accService.verifyAccount(token);
        });
    }
    isEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userService.isExist(email);
        });
    }
    isPhoneExist(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userService.getByPhone(phone);
        });
    }
    isUserVerified(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userService.isVerified(id);
        });
    }
    /**
     * Bank Account and Wallet Methods
     */
    /**
     * Payout Vendor Methods
     */
    getAllVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._payoutvendorService.getAllVendor();
        });
    }
    getAllActiveVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._payoutvendorService.getAllActiveVendors();
        });
    }
    getVendor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._payoutvendorService.getPVendorById(id);
        });
    }
    saveVendor(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.id == null)
                return yield this._payoutvendorService.createVendor(payload);
            else
                return yield this._payoutvendorService.updateVendor(payload);
        });
    }
    removeVendor(pvId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._payoutvendorService.removePaymentVendor(pvId);
        });
    }
    /**
     * Metrics
     */
    sendMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            //  user
            // pending order
            // code generated
            // current exchange rate
            let result = [];
            let allUserPromise = this._userService.getAllUsersCount();
            let pendingOrdersPromise = this._oService.getAllPendingOrdersCount();
            let codesGeneratedPromise = this._gcService.getAllCodesCount();
            let activeRatePromise = this._rService.getActiveRate();
            return yield Promise.all([
                allUserPromise,
                pendingOrdersPromise,
                codesGeneratedPromise,
                activeRatePromise,
            ]);
        });
    }
};
UserController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(user_service_1.UserService)),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.ctrl.js.map