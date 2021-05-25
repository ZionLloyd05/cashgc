"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentvendor_service_1 = require("./../services/paymentvendor.service");
const shared_service_1 = require("./../services/shared.service");
const account_service_1 = require("./../services/account.service");
const order_service_1 = require("./../services/order.service");
const rate_service_1 = require("./../services/rate.service");
const paystack_service_1 = require("../services/paystack.service");
const gc_service_1 = require("./../services/gc.service");
const auth_service_1 = require("./../services/auth.service");
const user_ctrl_1 = require("./../controllers/user.ctrl");
const user_service_1 = require("./../services/user.service");
const inversify_1 = require("inversify");
const gcc_service_1 = require("./../services/gcc.service");
const transaction_service_1 = require("../services/transaction.service");
const orderItem_service_1 = require("./../services/orderItem.service");
const payment_service_1 = require("./../services/payment.service");
/**
 * Dependency Injection Container
 */
const DIContainer = new inversify_1.Container();
/**
 * Binding up Dependencies
 */
DIContainer.bind(user_service_1.UserService).toSelf();
DIContainer.bind(user_ctrl_1.UserController).toSelf();
DIContainer.bind(gcc_service_1.GCCService).toSelf();
DIContainer.bind(auth_service_1.AuthService).toSelf();
DIContainer.bind(gc_service_1.GiftCodeService).toSelf();
DIContainer.bind(transaction_service_1.TransactionService).toSelf();
DIContainer.bind(paystack_service_1.PaystackService).toSelf();
DIContainer.bind(rate_service_1.RateService).toSelf();
DIContainer.bind(order_service_1.OrderService).toSelf();
DIContainer.bind(orderItem_service_1.OrderItemService).toSelf();
DIContainer.bind(account_service_1.AccountService).toSelf();
DIContainer.bind(shared_service_1.SharedService).toSelf();
DIContainer.bind(payment_service_1.PaymentService).toSelf();
DIContainer.bind(paymentvendor_service_1.PaymentVendorService).toSelf();
exports.default = DIContainer;
//# sourceMappingURL=DIContainer.js.map