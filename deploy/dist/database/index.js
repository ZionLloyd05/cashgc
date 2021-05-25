"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PaymentVendor_1 = require("../models/PaymentVendor");
const OrderItem_1 = require("./../models/OrderItem");
const Order_1 = require("./../models/Order");
const Wallet_1 = require("./../models/Wallet");
const BankAccount_1 = require("../models/BankAccount");
const Transaction_1 = require("../models/Transaction");
const GiftCodeCategory_1 = require("../models/GiftCodeCategory");
const GiftCode_1 = require("../models/GiftCode");
const CartItem_1 = require("../models/CartItem");
const User_1 = require("../models/User");
const Admin_1 = require("../models/Admin");
const typeorm_1 = require("typeorm");
const Rate_1 = require("../models/Rate");
class DatabaseProvider {
    static configure(configuration) {
        this._configuration = configuration;
    }
    static getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connection) {
                return this._connection;
            }
            if (!this._configuration) {
                throw new Error('DataProvider is not configured yet. ');
            }
            const { type, host, port, username, password, database, ssl, } = this._configuration;
            this._connection = yield typeorm_1.createConnection({
                type,
                host,
                port,
                username,
                password,
                database,
                extra: { ssl },
                entities: [
                    Admin_1.Admin,
                    User_1.User,
                    CartItem_1.CartItem,
                    GiftCode_1.GiftCode,
                    Transaction_1.Transaction,
                    GiftCodeCategory_1.GiftCodeCategory,
                    BankAccount_1.BankAccount,
                    Wallet_1.Wallet,
                    Rate_1.Rate,
                    Order_1.Order,
                    OrderItem_1.OrderItem,
                    PaymentVendor_1.PaymentVendor,
                ],
                synchronize: true,
            });
            return this._connection;
        });
    }
}
exports.DatabaseProvider = DatabaseProvider;
//# sourceMappingURL=index.js.map