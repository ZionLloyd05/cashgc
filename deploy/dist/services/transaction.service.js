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
const GiftCode_1 = require("./../models/GiftCode");
const index_1 = require("./../database/index");
const Transaction_1 = require("./../models/Transaction");
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const DIContainer_1 = require("../container/DIContainer");
let TransactionService = class TransactionService {
    /**
     *
     */
    constructor() {
        this._rService = DIContainer_1.default.resolve(rate_service_1.RateService);
        this.returnLast24HoursDate = function () {
            let today = new Date();
            let dayBeforeTimestamp = today.setDate(today.getDate() - 1);
            let dayBefore = new Date(dayBeforeTimestamp);
            return dayBefore;
        };
        this.daysBetween = function (date1, date2) {
            //Get 1 day in milliseconds
            var one_day = 1000 * 60 * 60 * 24;
            // Convert both dates to milliseconds
            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime();
            // Calculate the difference in milliseconds
            var difference_ms = date2_ms - date1_ms;
            // Convert back to days and return
            return Math.round(difference_ms / one_day);
        };
        this.isWithin24Hours = function (lastTransactionDate) {
            var today = new Date();
            var day = this.daysBetween(lastTransactionDate, today);
            if (day > 0) {
                return false;
            }
            return true;
        };
        /**
         * asynchronous version for .forEach methos
         */
        this.asyncForEach = (array, callback) => __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < array.length; index++) {
                yield callback(array[index], index, array);
            }
        });
        this.MAXIMUM_TRANSACTION_AMOUNT = 1000;
    }
    updateTransfer(transferPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('updating transfer');
            console.log(transferPayload);
            const db = yield index_1.DatabaseProvider.getConnection();
            const transferRepo = db.getRepository(Transaction_1.Transaction);
            return yield transferRepo.save(transferPayload);
        });
    }
    createTransaction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            var transaction = new Transaction_1.Transaction();
            let giftCodesArr = [];
            let { payment, type } = payload;
            console.log('from creation in transaction service');
            console.log(payment);
            console.log(type);
            if (payment === 2 && type === 1) {
                // converting dollar to naira
                payload.amount = yield this._rService.convertDollarToNaira(Number(payload.amount));
                //sales and payment with bitcoin
                // payload.gcodes.forEach(codeId =>)
                console.log('sales and payment with bitcoin');
                // set all coin to is used
                payload.gcodes &&
                    payload.gcodes.forEach((codeId) => __awaiter(this, void 0, void 0, function* () {
                        yield this.setCodeToUsed(codeId);
                    }));
            }
            else if (payment === 4 && type === 1) {
                // converting dollar to naira
                payload.amount = yield this._rService.convertDollarToNaira(Number(payload.amount));
                // set all coin to is used
                payload.gcodes &&
                    payload.gcodes.forEach((codeId) => __awaiter(this, void 0, void 0, function* () {
                        yield this.setCodeToUsed(codeId);
                    }));
            }
            else if (payment === 1 && type === 1) {
                // set all coin to is used
                payload.gcodes &&
                    payload.gcodes.forEach((codeId) => __awaiter(this, void 0, void 0, function* () {
                        yield this.setCodeToUsed(codeId);
                    }));
            }
            else if (payment === 5 && type === 1) {
                // set all coin to is used
                payload.gcodes &&
                    payload.gcodes.forEach((codeId) => __awaiter(this, void 0, void 0, function* () {
                        yield this.setCodeToUsed(codeId);
                    }));
            }
            else if (payment === 0 && type === 0) {
                // buy and ofcourse payment with paypal
                // console.log("buy and ofcourse payment with paypal");
            }
            else if (payment === 3 && type === 0) {
                // console.log("buy and pay with bank payment");
            }
            payload.gcodes &&
                payload.gcodes.forEach((codeId) => {
                    let giftCode = new GiftCode_1.GiftCode();
                    giftCode.id = codeId;
                    giftCodesArr.push(giftCode);
                });
            let newPayload = {
                status: payload.status,
                type: payload.type,
                giftCodes: giftCodesArr,
                user: payload.user,
                payment: payload.payment,
                paymentRef: payload.paymentRef,
                amount: payload.amount,
            };
            transaction = Object.assign({}, newPayload);
            return yield db.getRepository('Transaction').save(transaction);
        });
    }
    updateTransactionWithGcodes(gcodes, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let giftCodesArr = [];
            let transactionInDb = yield this.getTransactionById(transactionId);
            // console.log(transactionInDb);
            if (gcodes.length > 0) {
                gcodes.forEach((codeId) => {
                    let giftCode = new GiftCode_1.GiftCode();
                    giftCode.id = codeId;
                    giftCodesArr.push(giftCode);
                });
            }
            transactionInDb.giftCodes = giftCodesArr;
            /**
             * @TODOD auto generate a payment ref
             */
            return yield db.getRepository('Transaction').save(transactionInDb);
        });
    }
    setCodeToUsed(codeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const gcRepo = yield db.getRepository(GiftCode_1.GiftCode);
            // console.log(codeId);
            let gcInDb = yield gcRepo.findOne({
                where: { id: codeId },
            });
            // console.log(gcInDb);
            if (gcInDb)
                gcInDb.isUsed = true;
            yield gcRepo.save(gcInDb);
        });
    }
    getTransactionById(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            return yield db.getRepository(Transaction_1.Transaction).findOne(transactionId);
        });
    }
    getUserTransactions(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let transactions = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .innerJoinAndSelect('transaction.giftCodes', 'giftCodes')
                .innerJoinAndSelect('giftCodes.giftCodeCategory', 'giftCodeCategory')
                .where({ user: userid })
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            // console.log(transactions);
            return transactions;
        });
    }
    getUserTransactionsAlone(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let transactions = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .where({ user: userid })
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            // console.log(transactions);
            return transactions;
        });
    }
    getUserCodesByTransactionRef(userid, tref) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let transaction = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .where({ user: userid })
                .andWhere('transaction.paymentRef = :transactionRef')
                .innerJoinAndSelect('transaction.giftCodes', 'giftCodes')
                .innerJoinAndSelect('giftCodes.giftCodeCategory', 'giftCodeCategory')
                .setParameters({ transactionRef: tref })
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            return transaction;
        });
    }
    getTransactionByReference(tref) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let transactionInDb = yield db.getRepository('transaction').findOne({
                where: { paymentRef: tref },
            });
            return transactionInDb;
        });
    }
    getUserCodesByTransaction(userid, tid) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let transaction = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .where({ user: userid })
                .andWhere('transaction.id = :transactionId')
                .innerJoinAndSelect('transaction.giftCodes', 'giftCodes')
                .innerJoinAndSelect('giftCodes.giftCodeCategory', 'giftCodeCategory')
                .setParameters({ transactionId: tid })
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            return transaction;
        });
    }
    getAllCodesByTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let transaction = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .innerJoinAndSelect('transaction.giftCodes', 'giftCodes')
                .innerJoinAndSelect('giftCodes.giftCodeCategory', 'giftCodeCategory')
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            return transaction;
        });
    }
    getAllTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let transactions = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            return transactions;
        });
    }
    getSalesTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let transactions = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .where({ type: '1' })
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            return transactions;
        });
    }
    getPurchaseTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let transactions = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .where({ type: '0' })
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            return transactions;
        });
    }
    approveTransaction(tid) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            yield typeorm_1.createQueryBuilder('Transaction')
                .update(Transaction_1.Transaction)
                .set({ status: 0 })
                .where('id = :id', { id: tid })
                .execute();
            let newTransaction = yield db.getRepository('transaction').findOne({
                relations: ['user'],
                where: { id: tid },
            });
            return newTransaction;
        });
    }
    declineTransaction(tid) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            yield typeorm_1.createQueryBuilder('Transaction')
                .update(Transaction_1.Transaction)
                .set({ status: 1 })
                .where('id = :id', { id: tid })
                .execute();
            let newTransaction = yield db.getRepository('transaction').findOne({
                relations: ['user'],
                where: { id: tid },
            });
            console.log(newTransaction);
            return newTransaction;
        });
    }
    setTransactionStatusToSuccess(tid) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            yield typeorm_1.createQueryBuilder('Transaction')
                .update(Transaction_1.Transaction)
                .set({ status: 0 })
                .where('id = :id', { id: tid })
                .execute();
            let newTransaction = yield db.getRepository('transaction').findOne({
                where: { id: tid },
            });
            return newTransaction;
        });
    }
    canUserTransact(userId) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getAllTransactionForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield index_1.DatabaseProvider.getConnection();
            let userTransactions = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .where('transaction.user.id = :uid', { uid: userId })
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            return userTransactions;
        });
    }
    getUserTransactionsWithinLast24Hours(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let last24HoursDate = this.returnLast24HoursDate();
            let db = yield index_1.DatabaseProvider.getConnection();
            let transactions = yield db
                .getRepository('transaction')
                .createQueryBuilder('transaction')
                .innerJoinAndSelect('transaction.user', 'user')
                .where(`transaction.createdAt >= :startDate AND transaction.createdAt <= :endDate AND transaction.user.id = :userId`, { startDate: last24HoursDate, endDate: new Date(), userId })
                .orderBy({
                'transaction.id': 'DESC',
            })
                .getMany();
            return transactions;
        });
    }
    canMakeTransaction(userId, currentTransactionAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(currentTransactionAmount);
            let transactions = yield this.getUserTransactionsWithinLast24Hours(userId);
            // console.log(transactions)
            let totalTransactionAmount = this.totalAmountInTransactions(transactions);
            // console.log(totalTransactionAmount)
            let currentTransactionAmountInNaira = yield this._rService.convertDollarToNaira(currentTransactionAmount);
            let supposedTransactionTotal = totalTransactionAmount + currentTransactionAmountInNaira;
            // console.log(supposedTransactionTotal);
            let maxAmount = yield this.getDollar(this.MAXIMUM_TRANSACTION_AMOUNT);
            // console.log(maxAmount)
            if (supposedTransactionTotal > maxAmount)
                return false;
            else
                return true;
        });
    }
    /**
     * Helper methods
     */
    getDollar(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._rService.convertDollarToNaira(amount);
        });
    }
    totalAmountInTransactions(transactions) {
        let total = 0;
        transactions.forEach((transaction) => {
            total += transaction.amount;
        });
        return total;
    }
};
TransactionService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map