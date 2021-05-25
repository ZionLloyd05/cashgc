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
const GiftCodeCategory_1 = require("../models/GiftCodeCategory");
const inversify_1 = require("inversify");
const index_1 = require("../database/index");
const cloudinary = require("cloudinary");
const config_1 = require("../config");
let GCCService = class GCCService {
    /**
     *
     */
    constructor() {
        this.cloudinary = cloudinary.config({
            cloud_name: config_1.default.cloudName,
            api_key: config_1.default.apiKey,
            api_secret: config_1.default.apiSecret
        });
    }
    create(gcCategory, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(gcCategory);
            console.log("creating from service");
            const db = yield index_1.DatabaseProvider.getConnection();
            let newGCCategory = new GiftCodeCategory_1.GiftCodeCategory();
            let { isAvailable } = gcCategory;
            if (filePath != null) {
                const imageUrl = yield this.uploadImage(filePath);
                gcCategory.imageUrl = imageUrl;
                newGCCategory = Object.assign({}, gcCategory);
                if (isAvailable == "true")
                    newGCCategory.isAvailable = true;
                else if (isAvailable == "false")
                    newGCCategory.isAvailable = false;
            }
            else {
                newGCCategory = Object.assign({}, gcCategory);
                if (isAvailable == "true")
                    newGCCategory.isAvailable = true;
                else if (isAvailable == "false")
                    newGCCategory.isAvailable = false;
            }
            return yield db.getRepository(GiftCodeCategory_1.GiftCodeCategory).save(newGCCategory);
        });
    }
    update(gcCategory, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const gccRepository = db.getRepository(GiftCodeCategory_1.GiftCodeCategory);
            let gccInDb = yield gccRepository.findOne(gcCategory.id);
            let { title, imageUrl, sellingPrice, buyingPrice, prefix, isAvailable } = gcCategory;
            if (filePath != null) {
                let imageUrl = yield this.uploadImage(filePath);
                gccInDb.imageUrl = imageUrl;
                gccInDb.title = title;
                gccInDb.sellingPrice = sellingPrice;
                gccInDb.buyingPrice = buyingPrice;
                gccInDb.prefix = prefix;
                if (isAvailable == "true")
                    gccInDb.isAvailable = true;
                else if (isAvailable == "false")
                    gccInDb.isAvailable = false;
            }
            else {
                gccInDb.imageUrl = imageUrl;
                gccInDb.title = title;
                gccInDb.sellingPrice = sellingPrice;
                gccInDb.buyingPrice = buyingPrice;
                gccInDb.prefix = prefix;
                if (isAvailable == "true")
                    gccInDb.isAvailable = true;
                else if (isAvailable == "false")
                    gccInDb.isAvailable = false;
            }
            return yield gccRepository.save(gccInDb);
        });
    }
    uploadImage(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cloudinary.uploader.upload(filePath);
            console.log(result);
            return result.secure_url;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const gccRepository = yield db.getRepository(GiftCodeCategory_1.GiftCodeCategory);
            return yield gccRepository.findOne(id);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            return yield db.getRepository(GiftCodeCategory_1.GiftCodeCategory).find();
        });
    }
    toggleStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let gccInDb = yield this.getById(id);
            if (gccInDb.isAvailable == true)
                gccInDb.isAvailable = false;
            else if (gccInDb.isAvailable == false)
                gccInDb.isAvailable = true;
            return yield db.getRepository(GiftCodeCategory_1.GiftCodeCategory).save(gccInDb);
        });
    }
    getActiveCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            return yield db.getRepository(GiftCodeCategory_1.GiftCodeCategory).find({ isAvailable: true });
        });
    }
};
GCCService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], GCCService);
exports.GCCService = GCCService;
//# sourceMappingURL=gcc.service.js.map