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
const shared_service_1 = require("./shared.service");
const user_service_1 = require("./user.service");
const index_1 = require("./../database/index");
const User_1 = require("../models/User");
const mail_1 = require("../handlers/mail");
const DIContainer_1 = require("../container/DIContainer");
const inversify_1 = require("inversify");
let AccountService = class AccountService {
    constructor() {
        this._userService = DIContainer_1.default.resolve(user_service_1.UserService);
        this._sharedService = DIContainer_1.default.resolve(shared_service_1.SharedService);
    }
    forgotPassword(email, header) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            // 1. check if email exist
            let user = yield this._userService.getByEmail(email);
            // console.log(user);
            let error = '';
            if (!user) {
                // console.log("false");
                error = 'Account does not exist';
                return error;
            }
            // console.log("true");
            //2. set reset token and expiry
            user.utoken = this._sharedService.generateToken(25);
            var now = new Date();
            now.setMinutes(now.getMinutes() + 15); // timestamp
            now = new Date(now); // Date object
            user.uTokenExpiryDate = now; // 5 minutes from now
            yield db.getRepository(User_1.User).save(user);
            // console.log(user);
            // 3. send token to email
            const url = `${header}/account/reset/${user.utoken}`;
            const bodyHtml = `<h3>Hello Dear User,</h3><br/><p>Kindly click <a href="${url}"><b>here</b></a>, or copy and paste the link in your browser to reset your password,</p><br/>${url}<br/><p>From Cash GiftCode</p>`;
            const bodyText = `Hi dear user, click on the link attached to reset your password. ${url} , From Cash GiftCode`;
            let payload = {
                to: [user.email],
                subject: 'Password Reset',
                from: 'support@cashgiftcode.com',
                fromName: 'CashgiftCode',
                bodyHtml,
                bodyText,
            };
            // console.log(payload);
            yield this.sendEmail(payload).catch((err) => {
                console.log(err);
                return false;
            });
            return true;
        });
    }
    sendVerificationCode(email, header) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            // 1. check if email exist
            let user = yield this._userService.getByEmail(email);
            // console.log(user);
            let error = '';
            if (!user) {
                // console.log("false");
                error = 'Account does not exist';
                console.log(error);
                return false;
            }
            user.utoken = this._sharedService.generateToken(6);
            var now = new Date();
            now.setMinutes(now.getMinutes() + 15); // timestamp
            now = new Date(now); // Date object
            user.uTokenExpiryDate = now; // 5 minutes from now
            yield db.getRepository(User_1.User).save(user);
            yield db.getRepository(User_1.User).save(user);
            // console.log(user);
            // 3. send token to email
            const token = user.utoken;
            const bodyHtml = `<h3>Hi dear user,</h3><br/><p>Here's your token : ${token}</p>`;
            const bodyText = `Hi dear user, Here's your token ${token} , From Cash GiftCode`;
            let payload = {
                to: [user.email],
                subject: 'Email Verification Token',
                from: 'support@cashgiftcode.com',
                fromName: 'CashgiftCode',
                bodyHtml,
                bodyText,
            };
            yield this.sendEmail(payload).catch((err) => {
                console.log(err);
                return false;
            });
            return true;
        });
    }
    verifyAccount(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let user = yield this.isTokenValid(token);
            if (user == null)
                return false;
            user.isVerified = true;
            user.utoken = '';
            user.uTokenExpiryDate = '1990-10-02 10:00:00';
            let userUpdated = yield db.getRepository(User_1.User).save(user);
            if (Object.keys(userUpdated).length > 1)
                return true;
            else
                return false;
        });
    }
    isTokenValid(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            var now = new Date();
            now.setMinutes(now.getMinutes() + 1);
            now = new Date(now);
            let user = yield db
                .getRepository(User_1.User)
                .createQueryBuilder('user')
                .where({ utoken: token })
                .getOne();
            if (user != null) {
                let resetExpireTimeOut = user.uTokenExpiryDate;
                if (resetExpireTimeOut > now)
                    return user;
            }
            return null;
        });
    }
    checkTokenValidity(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.isTokenValid(token);
            if (user == null)
                return false;
            return true;
        });
    }
    updatePassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let user = yield this.isTokenValid(token);
            if (user == null)
                return false;
            user.password = this._userService.hashPassword(newPassword);
            user.uTokenExpiryDate = '1990-10-02 10:00:00';
            user.utoken = '';
            let userUpdated = yield db.getRepository(User_1.User).save(user);
            if (Object.keys(userUpdated).length > 1)
                return true;
            else
                return false;
        });
    }
    /**
     * sendEmail
     */
    sendEmail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const mail = new mail_1.Mail();
            yield mail.send(payload);
        });
    }
};
AccountService = __decorate([
    inversify_1.injectable()
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map