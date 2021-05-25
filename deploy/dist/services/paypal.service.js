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
const inversify_1 = require("inversify");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const config_1 = require("../config");
const DIContainer_1 = require("../container/DIContainer");
const gc_service_1 = require("./../services/gc.service");
let PayPalService = class PayPalService {
    constructor() {
        this._gcService = DIContainer_1.default.resolve(gc_service_1.GiftCodeService);
    }
    handleRequestVerification(orderId, totalAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("handling request verification");
            var request;
            try {
                request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
            }
            catch (error) {
                console.error(error);
                return error;
            }
            let order;
            try {
                order = yield this.client().execute(request);
                console.log(order);
                if (order.result.purchase_units[0].amount.value != totalAmount) {
                    return order;
                }
            }
            catch (error) {
                console.error(error);
                return error;
            }
        });
    }
    handleRequest(user, orderId, totalAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("handling request");
            /**1.
             * a sort of confirmation mechanism to verify if the person wh is logged in
             *	is the same as the person who paid
            //  */
            try {
                let order = yield this.handleRequestVerification(orderId, totalAmount);
                let paymentId = order.result.payer.payer_id;
                return yield this._gcService.scaffoldUserCode(user, paymentId);
            }
            catch (error) {
                console.error(error);
                return "error";
            }
        });
    }
    client() {
        return new checkoutNodeJssdk.core.PayPalHttpClient(this.environment());
    }
    environment() {
        let clientId = process.env.PAYPAL_CLIENT_ID;
        let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
        // console.log(config.environment === "production");
        if (config_1.default.environment === "production") {
            console.log("production");
            return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
        }
        else if (config_1.default.environment === "development") {
            console.log("sandbox");
            return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
        }
        return { error: "environment unknown" };
    }
};
PayPalService = __decorate([
    inversify_1.injectable()
], PayPalService);
exports.PayPalService = PayPalService;
//# sourceMappingURL=paypal.service.js.map