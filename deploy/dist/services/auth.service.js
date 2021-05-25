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
const index_1 = require("./../database/index");
const inversify_1 = require("inversify");
const Admin_1 = require("../models/Admin");
let AuthService = class AuthService {
    mustBeLoggedIn(req, res, next) {
        // console.log(req.originalUrl);
        // console.log(req.baseUrl);
        // console.log("user from authservice");
        // console.log(req.user);
        let user = req.user;
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.redirect("/signin");
        }
    }
    routeGaurd(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return next();
            let user = req.user;
            const db = yield index_1.DatabaseProvider.getConnection();
            let adminRepository = yield db.getRepository(Admin_1.Admin);
            let admin = yield adminRepository.findOne({ user: user });
            let url = req.originalUrl;
            let urlStringArr = url.split("/");
            let entity = urlStringArr[1];
            // console.log("here" + Object.keys(admin).length + " " + entity);
            if (admin && admin != null && entity == "user") {
                res.redirect("/admin");
                // console.log("an admin");
            }
            else if ((admin == undefined || admin == null) && entity == "admin") {
                // console.log("thief");
                res.redirect("/logout");
            }
            else {
                // console.log("none");
                next();
            }
            // if (admin && admin != null) {
            //   conso
            // }
            // else {
            // }
        });
    }
};
AuthService = __decorate([
    inversify_1.injectable()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map