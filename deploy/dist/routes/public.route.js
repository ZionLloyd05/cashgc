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
const passport = require("passport");
const csurf = require("csurf");
const DIContainer_1 = require("../container/DIContainer");
class PublicRoute {
    constructor() {
        this._userController = DIContainer_1.default.resolve(user_ctrl_1.UserController);
    }
    initialize(router) {
        const csrfProtection = csurf();
        // router.use(csrfProtection);
        router.get("/", this.serveHomeView.bind(this));
        router.get("/signup", this.serveSignupView.bind(this));
        router.get("/signin", this.serveSignInView.bind(this));
        router.get("/privacy", this.servePrivacyView.bind(this));
        router.get("/reset-password", this.serveForgotPasswordView.bind(this));
        router.get("/reset-password/:msg", this.serveForgotPasswordView.bind(this));
        router.post("/reset-password", this.forgotPassword.bind(this));
        router.get("/logout", this.logout.bind(this));
        router.post("/signin", passport.authenticate("local-signin", {
            successRedirect: "/user/store",
            failureRedirect: "/signin",
            failureFlash: true
        }));
        router.post("/signup", passport.authenticate("local-signup", {
            successRedirect: "/user/store",
            failureRedirect: "/signin",
            failureFlash: true
        }));
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            let header = req.headers.host;
            let response = yield this._userController.forgotPassword(email, header);
            if (response === true) {
                res.render("forgot", {
                    title: "Reset Password",
                    layout: "authLayout",
                    hasMessage: true,
                    message: "Reset link has been sent to your email."
                });
            }
            else if (response === false) {
                res.render("forgot", {
                    title: "Reset Password",
                    layout: "authLayout",
                    hasMessage: true,
                    message: "Account does not exist."
                });
            }
            else {
                res.render("forgot", {
                    title: "Reset Password",
                    layout: "authLayout",
                    hasMessage: true,
                    message: response
                });
            }
        });
    }
    serveForgotPasswordView(req, res) {
        let msg = req.params.msg;
        if (msg != null) {
            return res.render("forgot", {
                title: "Reset Password",
                layout: "authLayout",
                hasMessage: true,
                message: msg
            });
        }
        else {
            return res.render("forgot", {
                title: "Reset Password",
                layout: "authLayout"
            });
        }
    }
    serveHomeView(req, res) {
        res.render("index", {
            title: "Home"
            // csrfToken: req.csrfToken()
        });
    }
    serveSignupView(req, res) {
        res.render("signup", {
            title: "Sign Up",
            layout: "authLayout"
            // csrfToken: req.csrfToken()
        });
    }
    servePrivacyView(req, res) {
        res.render("privacy", {
            title: "Privacy",
            layout: "layout"
        });
    }
    serveSignInView(req, res) {
        var message = req.flash("error");
        res.render("signin", {
            title: "Sign In",
            layout: "authLayout",
            message,
            hasError: message != ""
            // csrfToken: req.csrfToken()
        });
    }
    logout(req, res) {
        req.logout();
        res.redirect("/");
    }
}
exports.PublicRoute = PublicRoute;
//# sourceMappingURL=public.route.js.map