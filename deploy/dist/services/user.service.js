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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const Wallet_1 = require("./../models/Wallet");
const BankAccount_1 = require("../models/BankAccount");
const CartItem_1 = require("./../models/CartItem");
const gcc_service_1 = require("./gcc.service");
const index_1 = require("./../database/index");
const User_1 = require("../models/User");
const inversify_1 = require("inversify");
const bcrypt = require("bcryptjs");
let UserService = class UserService {
    constructor(gccService) {
        this.gccService = gccService;
        this._gccService = gccService;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let newUser = new User_1.User();
            newUser = Object.assign({}, user);
            newUser.password = this.hashPassword(user.password);
            //console.log(newUser);
            return yield db.getRepository(User_1.User).save(newUser);
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const userRepository = db.getRepository(User_1.User);
            let userInDb = yield userRepository.findOne(user.id);
            const { firstname, lastname, email, phone, country } = user;
            userInDb.firstname = firstname;
            userInDb.lastname = lastname;
            userInDb.email = email;
            userInDb.country = country;
            userInDb.phone = phone;
            return yield userRepository.save(userInDb);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const userRepository = yield db.getRepository(User_1.User);
            return userRepository.findOne(id);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            return yield db.getRepository(User_1.User).find();
        });
    }
    getAllUsersCount() {
        return __awaiter(this, void 0, void 0, function* () {
            var users = yield this.getAll();
            return users.length;
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const userRepository = yield db.getRepository(User_1.User);
            const userInDb = yield userRepository.findOne({ email: email });
            if (userInDb)
                return userInDb;
            else
                return null;
        });
    }
    isExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getByEmail(email);
            if (user)
                return true;
            else
                return false;
        });
    }
    isVerified(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getById(id);
            if (user.isVerified) {
                return true;
            }
            return false;
        });
    }
    togglePartnership(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const userRepository = yield db.getRepository(User_1.User);
            const user = yield userRepository.findOne(id);
            if (user.isPartner === true) {
                user.isPartner = false;
            }
            else if (user.isPartner === false) {
                user.isPartner = true;
            }
            return yield userRepository.save(user);
        });
    }
    isPhoneExist(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getByPhone(phone);
            if (user)
                return true;
            else
                return false;
        });
    }
    getByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const userRepository = yield db.getRepository("user");
            const userInDb = yield userRepository
                .createQueryBuilder()
                .where("user.phone like :phonenumber", { phonenumber: "%" + phone + "%" })
                .getOne();
            if (userInDb)
                return userInDb;
            else
                return null;
        });
    }
    addToCart(gccId, userId, qty) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("trying to add to cart");
            const db = yield index_1.DatabaseProvider.getConnection();
            const cartRepo = db.getRepository(CartItem_1.CartItem);
            const gcccategory = yield this._gccService.getById(gccId);
            const user = yield this.getById(userId);
            const cartItemInDb = yield cartRepo.findOne({
                relations: ["giftCodeCategory"],
                where: { giftCodeCategory: gcccategory, user: user }
            });
            // console.log(cartItemInDb);
            if (cartItemInDb && cartItemInDb != null) {
                // console.log("found the cart item in db");
                cartItemInDb.quantity += qty;
                cartItemInDb.total += gcccategory.sellingPrice * qty;
                yield cartRepo.save(cartItemInDb);
                // console.log(cartItemInDb)
                return cartItemInDb;
            }
            // console.log("its a new item, adding a new row of item");
            let cartItem = new CartItem_1.CartItem();
            cartItem.quantity = qty;
            cartItem.giftCodeCategory = gcccategory;
            cartItem.user = user;
            cartItem.total = gcccategory.sellingPrice * qty;
            yield cartRepo.save(cartItem);
            return true;
        });
    }
    removeFromCart(gccId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("trying to remove to cart");
            // console.log(gccId);
            // console.log(userId);
            const db = yield index_1.DatabaseProvider.getConnection();
            const cartRepo = db.getRepository(CartItem_1.CartItem);
            const gcccategory = yield this._gccService.getById(gccId);
            const user = yield this.getById(userId);
            let cartItemInDb = yield cartRepo.findOne({
                relations: ["giftCodeCategory"],
                where: { giftCodeCategory: gcccategory, user: user }
            });
            // console.log(cartItemInDb);
            if (cartItemInDb && cartItemInDb != null) {
                cartItemInDb.quantity -= 1;
                cartItemInDb.total -= gcccategory.sellingPrice;
                if (cartItemInDb.quantity == 0) {
                    // console.log("removing entity");
                    yield cartRepo.remove(cartItemInDb);
                    return null;
                }
                yield cartRepo.save(cartItemInDb);
                return cartItemInDb;
            }
        });
    }
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("clearing cart");
            const db = yield index_1.DatabaseProvider.getConnection();
            try {
                yield db
                    .createQueryBuilder()
                    .delete()
                    .from(CartItem_1.CartItem)
                    .where("user", { user: userId })
                    .execute();
            }
            catch (ex) {
                // console.log(ex);
            }
        });
    }
    getCartItem(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const itemRepo = yield db.getRepository(CartItem_1.CartItem);
            // const items = await itemRepo.find({ user: user});
            const items = yield itemRepo
                .createQueryBuilder("CartItem")
                .innerJoinAndSelect("CartItem.giftCodeCategory", "gcc", "CartItem.giftCodeCategory = gcc.id")
                .where("CartItem.user = :user", { user: user.id })
                .getMany();
            let totalQuantity = 0;
            let totalPrice = 0;
            items.forEach(item => {
                totalQuantity += item.quantity;
                totalPrice += item.total;
            });
            let itemBundle = {
                items,
                totalQuantity,
                totalPrice
            };
            return itemBundle;
        });
    }
    authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let userFound = null;
            yield this.getByEmail(email).then(user => {
                if (user != null) {
                    const isValid = this.comparePassword(password, user.password);
                    if (isValid) {
                        userFound = user;
                    }
                }
                else {
                    return null;
                }
            });
            let userDto;
            userDto = Object.assign({}, userFound);
            return userDto;
        });
    }
    updatePassword(email, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let user = yield this.authenticate(email, currentPassword);
            // console.log(user);
            if (Object.keys(user).length <= 0) {
                return "incorrect credentials";
            }
            let hashedPwd = this.hashPassword(newPassword);
            let updatedUser = new User_1.User();
            updatedUser = Object.assign({}, user);
            updatedUser.password = hashedPwd;
            yield db.getRepository(User_1.User).save(updatedUser);
            // console.log(updatedUser);
            return "updated";
        });
    }
    createAccount(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const accountRepo = yield db.getRepository(BankAccount_1.BankAccount);
            let newbkAccount = yield new BankAccount_1.BankAccount();
            newbkAccount.name = payload.name;
            newbkAccount.number = payload.number;
            newbkAccount.user = payload.user;
            return yield accountRepo.save(newbkAccount);
        });
    }
    /***
     * Wallet Methods
     */
    createWallet(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const walletRepo = yield db.getRepository(Wallet_1.Wallet);
            let newWallet = yield new Wallet_1.Wallet();
            newWallet.wid = payload.wid;
            newWallet.user = payload.user;
            return yield walletRepo.save(newWallet);
        });
    }
    updateWallet(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const walletRepo = yield db.getRepository(Wallet_1.Wallet);
            let walletInDb = yield walletRepo.findOne(wallet.id);
            const { wid } = wallet;
            walletInDb.wid = wid;
            return yield walletRepo.save(walletInDb);
        });
    }
    getWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const walletRepo = yield db.getRepository(Wallet_1.Wallet);
            const uwallet = yield walletRepo.findOne({
                where: { user: userId }
            });
            // console.log(uwallet);
            return uwallet;
        });
    }
    /**
     * Bank Account Methods
     */
    updateAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const accountRepo = yield db.getRepository(BankAccount_1.BankAccount);
            let accountInDb = yield accountRepo.findOne(account.id);
            const { name, number } = account;
            accountInDb.name = name;
            accountInDb.number = number;
            let updated = yield accountRepo.save(accountInDb);
            return updated;
        });
    }
    getAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            const accountRepo = yield db.getRepository(BankAccount_1.BankAccount);
            return yield accountRepo.findOne({
                where: { user: userId }
            });
        });
    }
    getAdminAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield index_1.DatabaseProvider.getConnection();
            let adminAccount = yield db
                .getRepository("bankaccount")
                .createQueryBuilder("bankaccount")
                .innerJoinAndSelect("bankaccount.user", "user")
                .innerJoinAndSelect("admin.user", "user")
                .getOne();
            return adminAccount;
        });
    }
    /**   *
     * This is a helper function used for data encryption, password in this use case.
     * @param data: string | number;
     */
    hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
    }
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
};
UserService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(gcc_service_1.GCCService)),
    __metadata("design:paramtypes", [gcc_service_1.GCCService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map