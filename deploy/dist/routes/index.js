"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("./account");
const admin_1 = require("./admin");
const user_1 = require("./user");
const public_route_1 = require("./public.route");
const ping_1 = require("./ping");
exports.ROUTERS = [
    new ping_1.PingRoute(),
    new public_route_1.PublicRoute(),
    new user_1.UserRoute(),
    new admin_1.AdminRoute(),
    new account_1.AccountRoute()
];
//# sourceMappingURL=index.js.map