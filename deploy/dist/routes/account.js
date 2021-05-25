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
const user_ctrl_1 = require("./../controllers/user.ctrl");
const csurf = require("csurf");
const DIContainer_1 = require("../container/DIContainer");
class AccountRoute {
    constructor() {
        this._userController = DIContainer_1.default.resolve(user_ctrl_1.UserController);
    }
    initialize(router) {
        const csrfProtection = csurf();
        router.use(csrfProtection);
        router.get("/account/reset/:token", this.serveResetView.bind(this));
        router.post("/account/reset/:token", this.updatePassword.bind(this));
        router.post("/account/sendtoken", this.sendToken.bind(this));
        router.post("/account/verifyme/:token", this.verifyUser.bind(this));
    }
    serveResetView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.params.token;
            let response = yield this._userController.confirmTokenValidity(token);
            if (!response) {
                console.log("false");
                let msg = "Password reset is invalid or has expired";
                return res.redirect(`/reset-password/${msg}`);
            }
            else {
                console.log("true");
                res.render("reset", {
                    title: "Reset Password",
                    layout: "authLayout",
                    csrfToken: req.csrfToken()
                });
            }
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.params.token;
            let newPassword = req.body.password;
            let response = yield this._userController.updateResetPassword(token, newPassword);
            if (response == true) {
                res.redirect("/signin");
            }
        });
    }
    sendToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEmail = req.user.email;
            let header = req.headers.host;
            let response = yield this._userController.sendToken(userEmail, header);
            if (response === true) {
                res.send({
                    status: "success"
                });
            }
            else {
                res.send({
                    status: "Account not found"
                });
            }
        });
    }
    // next up --> test sending of token
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.params.token;
            let response = yield this._userController.verifyUser(token);
            if (response === true) {
                res.send({
                    status: "success"
                });
            }
            else {
                res.send({
                    status: "Something went wrong, try again"
                });
            }
        });
    }
}
exports.AccountRoute = AccountRoute;
//# sourceMappingURL=account.js.map