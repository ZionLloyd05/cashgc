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
const User_1 = require("./../models/User");
const user_service_1 = require("./../services/user.service");
const passport_local_1 = require("passport-local");
const DIContainer_1 = require("../container/DIContainer");
class PassportConfig {
}
PassportConfig._userService = DIContainer_1.default.resolve(user_service_1.UserService);
PassportConfig.bootstrap = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
        yield PassportConfig._userService
            .getById(id)
            .then(user => {
            let userDto;
            userDto = Object.assign({}, user);
            // console.log(userDto);
            done(null, userDto);
        })
            .catch(err => done(err, null));
    }));
    let options = {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    };
    let verifySignUp = (req, username, password, done) => {
        process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
            yield PassportConfig._userService
                .isExist(username)
                .then((isExist) => __awaiter(this, void 0, void 0, function* () {
                if (isExist) {
                    return done(null, false, req.flash("error", "Email already exist"));
                }
                else {
                    let newUser = new User_1.User();
                    let newPhone = req.body.phoneCode + "" + req.body.phone;
                    req.body.phone = newPhone;
                    newUser = Object.assign({}, req.body);
                    yield PassportConfig._userService
                        .create(newUser)
                        .then((user) => __awaiter(this, void 0, void 0, function* () {
                        let userDto;
                        userDto = Object.assign({}, user);
                        return done(null, userDto);
                    }))
                        .catch(error => done(error, null));
                }
            }));
        }));
    };
    let verifySignIn = (req, email, password, done) => {
        process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
            yield PassportConfig._userService
                .authenticate(email, password)
                .then(user => {
                if (Object.keys(user).length > 0) {
                    let userDto;
                    userDto = Object.assign({}, user);
                    return done(null, userDto);
                }
                else {
                    return done(null, null, req.flash("error", "Incorrect Credentials"));
                }
            })
                .catch(err => {
                console.log(err);
                return done(null, err);
            });
        }));
    };
    passport.use("local-signup", new passport_local_1.Strategy(options, verifySignUp));
    passport.use("local-signin", new passport_local_1.Strategy(options, verifySignIn));
};
exports.PassportConfig = PassportConfig;
//# sourceMappingURL=passport.js.map