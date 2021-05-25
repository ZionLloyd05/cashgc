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
const paystack_service_1 = require("./../services/paystack.service");
const user_service_1 = require("./../services/user.service");
const User_1 = require("./../models/User");
const GiftCodeCategory_1 = require("./../models/GiftCodeCategory");
const gcc_ctrl_1 = require("./../controllers/gcc.ctrl");
const auth_service_1 = require("./../services/auth.service");
const csurf = require("csurf");
const DIContainer_1 = require("../container/DIContainer");
const multer = require("multer");
const user_ctrl_1 = require("./../controllers/user.ctrl");
class AdminRoute {
    /**
     *
     */
    constructor() {
        this._authService = DIContainer_1.default.resolve(auth_service_1.AuthService);
        this._gcController = DIContainer_1.default.resolve(gcc_ctrl_1.GccController);
        this._userController = DIContainer_1.default.resolve(user_ctrl_1.UserController);
        this._userService = DIContainer_1.default.resolve(user_service_1.UserService);
        this._paystackService = DIContainer_1.default.resolve(paystack_service_1.PaystackService);
        this.storage = multer.diskStorage({
            filename: function (req, file, callback) {
                // accept image files only
                callback(null, Date.now() + file.originalname);
            },
        });
        this.upload = multer({
            storage: this.storage,
            fileFilter(req, file, next) {
                const isPhoto = file.mimetype.startsWith('image/');
                if (isPhoto) {
                    next(null, true);
                }
                else {
                    next(new Error('File not supported'), false);
                }
            },
        });
    }
    initialize(router) {
        const csrfProtection = csurf();
        router.use(csrfProtection);
        router.all('/admin/*', this._authService.mustBeLoggedIn);
        router.all('/admin/*', this._authService.routeGaurd);
        router.get('/admin', this._authService.mustBeLoggedIn, this._authService.routeGaurd, this.serveDashboardView.bind(this));
        /**
         * Category Routes
         */
        router.get('/admin/gc/categories', this.serveCategoryView.bind(this));
        router.get('/admin/category', this.getAllCategory.bind(this));
        router.post('/admin/category', this.upload.single('image'), this.saveCategory.bind(this));
        /**
         * Transaction Routes
         */
        router.get('/admin/transaction/', this.serveTransactionView.bind(this));
        router.get('/admin/transactions', this.getTransaction.bind(this));
        router.post('/admin/transactions', this.updateTransaction.bind(this));
        /**
         * Wallets Routes
         */
        router.get('/admin/wallet/:id', this.getWalletByUser.bind(this));
        /**
         * Gift Code Routes
         */
        router.get('/admin/giftcodes', this.serveCodeView.bind(this));
        router.get('/admin/codesbytransaction', this.getAllCodes.bind(this));
        router.post('/admin/bulkactivation', this.bulkAction.bind(this));
        /**
         * Users Routes
         */
        router.get('/admin/users', this.serveUserView.bind(this));
        router.get('/admin/user', this.getUsers.bind(this));
        router.put('/admin/user/partner', this.togglePartnership.bind(this));
        /**
         * Rates Routes
         */
        router.get('/admin/exchange-rates', this.serveRateView.bind(this));
        router.get('/admin/rate', this.getRateOperation.bind(this));
        router.post('/admin/rate', this.saveRate.bind(this));
        router.post('/admin/rate/status', this.toggleStatus.bind(this));
        router.delete('/admin/rate', this.removeRate.bind(this));
        /**
         * Orders Routes
         */
        router.get('/admin/orders', this.serveOrdersView.bind(this));
        router.get('/admin/owolyte-orders', this.serveOwolyteOrdersView.bind(this));
        router.get('/admin/order', this.getOrderOperation.bind(this));
        router.post('/admin/order', this.processOrder.bind(this));
        /**
         * Product Route
         */
        router.get('/admin/product', this.ServeProductView.bind(this));
        /**
         * Profile Routes
         */
        router.get('/admin/profile', this.serveProfileView.bind(this));
        /**
         * Bank Account Route
         */
        router.get('/admin/bkaccount', this.getAccount.bind(this));
        router.post('/admin/bkaccount', this.saveAccount.bind(this));
        router.get('/admin/getUserAccount/:id', this.getUserAccount.bind(this));
        /**
         * Bitcoin Wallet Route
         */
        router.get('/admin/wallet', this.getWallet.bind(this));
        router.post('/admin/wallet', this.saveWallet.bind(this));
        /**
         * Payout Vendor Route
         */
        router.get('/admin/payment-vendor', this.servePaymentVendorView.bind(this));
        router.get('/admin/paymentvendor', this.getPaymentVendors.bind(this));
        router.post('/admin/paymentvendor', this.saveVendor.bind(this));
        router.delete('/admin/paymentvendor', this.removePaymentVendor.bind(this));
        /**
         * Miscellenous Route
         */
        router.get('/admin/banks', this.fetchBanks.bind(this));
        router.get('/admin/analytics', this.sendMetrics.bind(this));
    }
    serveUserView(req, res) {
        res.render('admin/user', {
            title: 'User',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isUser: true,
        });
    }
    serveDashboardView(req, res) {
        res.render('admin/index', {
            title: 'Dashboard',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isDashboard: true,
        });
    }
    serveOrdersView(req, res) {
        res.render('admin/orders', {
            title: 'Orders',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isOrder: true,
        });
    }
    serveOwolyteOrdersView(req, res) {
        res.render('admin/owolyteorder', {
            title: 'Owolyte Orders',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isOwolyteOrder: true,
        });
    }
    ServeProductView(req, res) {
        res.render('admin/product', {
            title: 'Owolyte Product',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isProduct: true,
        });
    }
    serveCategoryView(req, res) {
        res.render('admin/gccategory', {
            title: 'GC Category',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isCategory: true,
        });
    }
    serveTransactionView(req, res) {
        let category = req.query.category;
        if (category == 'sales')
            this.serveSalesTransactionView(req, res);
        else if (category == 'purchase')
            this.servePurchaseTransactionView(req, res);
    }
    serveSalesTransactionView(req, res) {
        res.render('admin/sales-transaction', {
            title: 'Transactions',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isSalesTransaction: true,
        });
    }
    servePurchaseTransactionView(req, res) {
        res.render('admin/purchase-transaction', {
            title: 'Transactions',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isPurchaseTransaction: true,
        });
    }
    serveCodeView(req, res) {
        res.render('admin/codes', {
            title: 'Gift Codes',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isCodes: true,
        });
    }
    servePaymentVendorView(req, res) {
        res.render('admin/payment-vendor', {
            title: 'Payout Vendors',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isPayout: true,
        });
    }
    serveRateView(req, res) {
        res.render('admin/rate', {
            title: 'Rates',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isRate: true,
        });
    }
    serveProfileView(req, res) {
        res.render('admin/profile', {
            title: 'Profile',
            layout: 'adminLayout',
            csrfToken: req.csrfToken(),
            isRate: true,
        });
    }
    saveCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("here");
            // console.log(req.body);
            // console.log(req.body.id == "null");
            if (req.body.id && req.body.id == 'null') {
                // console.log("")
                console.log('creating category');
                // create new
                let gcc = new GiftCodeCategory_1.GiftCodeCategory();
                let newGcc;
                if (req.file) {
                    let filePath = req.file.path;
                    gcc = Object.assign({}, req.body);
                    newGcc = yield this._gcController.saveGcc(gcc, filePath);
                }
                else {
                    gcc = Object.assign({}, req.body);
                    newGcc = yield this._gcController.saveGcc(gcc, null);
                }
                return res.send({
                    status: 'created',
                    data: newGcc,
                });
            }
            else if (req.body.id && req.body.id != 'null') {
                console.log('updating catgeory');
                let gcc = new GiftCodeCategory_1.GiftCodeCategory();
                let updatedGcc;
                if (req.file) {
                    let filePath = req.file.path;
                    gcc = Object.assign({}, req.body);
                    updatedGcc = yield this._gcController.saveGcc(gcc, filePath);
                }
                else {
                    gcc = Object.assign({}, req.body);
                    updatedGcc = yield this._gcController.saveGcc(gcc, null);
                }
                return res.send({
                    status: 'updated',
                    data: updatedGcc,
                });
            }
        });
    }
    getAllCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let gccs = yield this._gcController.getAllGCCs();
            return res.send({
                status: 'read',
                data: gccs,
            });
        });
    }
    togglePartnership(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.body.id;
            let response = yield this._userController.togglePartnership(userId);
            return res.send({
                status: 'success',
                data: response,
            });
        });
    }
    getTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionCategory = req.query.category;
            let transactions;
            if (transactionCategory == 'sales') {
                transactions = yield this._userController.getSalesTransaction();
            }
            else if (transactionCategory == 'purchase') {
                transactions = yield this._userController.getPurchaseTransaction();
            }
            return res.send({
                status: 'read',
                data: transactions,
            });
        });
    }
    getWalletByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let uwallet = yield this._userController.getWallet(req.params.id);
            return res.send({
                status: 'read',
                data: uwallet,
            });
        });
    }
    updateTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactId = req.query.tid;
            let operation = req.query.operation;
            let newTransaction = yield this._userController.updateTransaction(transactId, operation);
            return res.send({
                status: 'update',
                data: newTransaction,
            });
        });
    }
    getAllCodes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactions = yield this._userController.getAllCodesByTransaction();
            return res.send({
                status: 'read',
                data: transactions,
            });
        });
    }
    getRateOperation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.query && req.query.id) {
                let rate = yield this._userController.getRateById(req.query.id);
                return res.send({
                    status: 'read',
                    data: rate,
                });
            }
            let rates = yield this._userController.getAllRate();
            return res.send({
                status: 'read',
                data: rates,
            });
        });
    }
    saveRate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let rate = yield this._userController.saveRate(req.body);
            if (req.body.id == 0) {
                return res.send({
                    status: 'create',
                    data: rate,
                });
            }
            else if (req.body.id != 0) {
                return res.send({
                    status: 'update',
                    data: rate,
                });
            }
        });
    }
    fetchBanks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const banks = yield this._paystackService.fetchBanks();
            return res.send({
                status: 'read',
                data: banks,
            });
        });
    }
    saveAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = Object.assign({}, req.body);
            account.user = req.user.id;
            let newBankacc = yield this._userController.saveAccount(account);
            return res.send({
                status: 'save',
                data: newBankacc,
            });
        });
    }
    getAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uacc = yield this._userController.getAccount(req.user.id);
            return res.send({
                status: 'read',
                data: uacc,
            });
        });
    }
    getUserAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uacc = yield this._userController.getAccount(req.params.id);
            return res.send({
                status: 'read',
                data: uacc,
            });
        });
    }
    toggleStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { isactive, id } = req.body;
            if (isactive === true) {
                let response = yield this._userController.deactiveRate(id);
                return res.send({
                    status: 'true',
                    data: response,
                });
            }
            else if (isactive === false) {
                let response = yield this._userController.activateRate(id);
                if (typeof response === 'string') {
                    // an error is returned
                    return res.send({
                        status: 'false',
                        data: response,
                    });
                }
                return res.send({
                    status: 'true',
                    data: response,
                });
            }
        });
    }
    removeRate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let rateId = req.query.id;
            let response = yield this._userController.removeRate(rateId);
            return res.send({
                status: 'true',
                data: response,
            });
        });
    }
    getOrderOperation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.query && req.query.id) {
                // get order by id function
                let order = yield this._userController.getOrderById(req.query.id);
                return res.send({
                    status: 'true',
                    data: order,
                });
            }
            let orders = yield this._userController.getAllOrder();
            return res.send({
                status: 'true',
                data: orders,
            });
        });
    }
    processOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { uid, oid } = req.body;
            let user = new User_1.User();
            user.id = uid;
            let response = yield this._userController.processOrder(oid, user);
            return res.send({
                status: 'true',
                data: response,
            });
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this._userController.getAllUsers();
            res.send({
                status: 'read',
                data: response,
            });
        });
    }
    saveWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet = Object.assign({}, req.body);
            wallet.user = req.user.id;
            let newWallet = yield this._userController.saveWallet(wallet);
            return res.send({
                status: 'save',
                data: newWallet,
            });
        });
    }
    getWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uwallet = yield this._userController.getWallet(req.user.id);
            return res.send({
                status: 'read',
                data: uwallet,
            });
        });
    }
    bulkAction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { payload, operation } = req.body;
            let response = yield this._userController.bulkAction(payload, operation);
            console.log(response);
            return res.send({
                status: 'done',
                data: response,
            });
        });
    }
    getPaymentVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var id = req.query.id;
            let response;
            if (id == null)
                response = yield this._userController.getAllVendors();
            else
                response = yield this._userController.getVendor(id);
            return res.send({
                status: 'read',
                data: response,
            });
        });
    }
    saveVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            let payload = req.body;
            let vendor = yield this._userController.saveVendor(payload);
            if (payload.id == null) {
                return res.send({
                    status: 'create',
                    data: vendor,
                });
            }
            else {
                return res.send({
                    status: 'update',
                    data: vendor,
                });
            }
        });
    }
    removePaymentVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let pvId = req.query.id;
            let response = yield this._userController.removeVendor(pvId);
            return res.send({
                status: 'true',
                data: response,
            });
        });
    }
    sendMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this._userController.sendMetrics();
            return res.send({
                status: 'true',
                data: response,
            });
        });
    }
}
exports.AdminRoute = AdminRoute;
//# sourceMappingURL=admin.js.map