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
const transaction_service_1 = require("./../services/transaction.service");
const user_ctrl_1 = require("./../controllers/user.ctrl");
const gcc_ctrl_1 = require("./../controllers/gcc.ctrl");
const auth_service_1 = require("./../services/auth.service");
const DIContainer_1 = require("../container/DIContainer");
const multer = require("multer");
const csurf = require("csurf");
const paystack_service_1 = require("../services/paystack.service");
const paypal_service_1 = require("../services/paypal.service");
const config_1 = require("../config");
const axios_1 = require("axios");
const payment_service_1 = require("./../services/payment.service");
class UserRoute {
    constructor() {
        this.itemTotalAmount = 0;
        this._authService = DIContainer_1.default.resolve(auth_service_1.AuthService);
        this._gcController = DIContainer_1.default.resolve(gcc_ctrl_1.GccController);
        this._userController = DIContainer_1.default.resolve(user_ctrl_1.UserController);
        this._tService = DIContainer_1.default.resolve(transaction_service_1.TransactionService);
        this._paystackService = DIContainer_1.default.resolve(paystack_service_1.PaystackService);
        this._payPalService = DIContainer_1.default.resolve(paypal_service_1.PayPalService);
        this._paymentService = DIContainer_1.default.resolve(payment_service_1.PaymentService);
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
        router.post('/user/isemailexist', this.isEmailUnique.bind(this));
        router.post('/user/isphoneexist', this.isPhoneUnique.bind(this));
        router.get('/user/pay-callback', this.handlePaymentVendorCallback.bind(this));
        router.post('/user/transfer-callback', this.handleTransferCallback.bind(this));
        router.get('/user/pay-failed-callback', this.handlePaymentFailure.bind(this));
        const csrfProtection = csurf();
        router.use(csrfProtection);
        router.all('/user/*', this._authService.mustBeLoggedIn);
        router.all('/user/*', this._authService.routeGaurd);
        router.get('/user', this._authService.mustBeLoggedIn, this._authService.routeGaurd, this.serveDashboardView.bind(this));
        router.get('/user/store', this.serveStoreView.bind(this));
        router.get('/user/cart', this.serveCartView.bind(this));
        router.get('/user/profile', this.serveProfileView.bind(this));
        router.post('/user/account', this.saveProfile.bind(this));
        /**
         * Gift Category routes
         */
        router.get('/user/category', this.getActiveCategories.bind(this));
        /**
         * Cart Item routes
         */
        router.get('/user/cartitem', this.cartItemOperation.bind(this));
        router.post('/user/cartitem', this.addItemToCart.bind(this));
        router.delete('/user/cartitem', this.clearCart.bind(this));
        router.get('/user/cartitem/:id', this.removeFromCart.bind(this));
        /**
         * Invoice route
         */
        router.get('/user/invoice', this.serveInvoiceView.bind(this));
        /**
         * GiftCode routes
         */
        router.post('/user/giftcode', this.scaffoldcodes.bind(this));
        router.get('/user/my-codes', this.serveCodeView.bind(this));
        router.get('/user/sales', this.serveSalesView.bind(this));
        router.get('/user/verify/:code', this.verifyCode.bind(this));
        /**
         * Transaction routes
         */
        router.get('/user/transactions', this.serveTransactionView.bind(this));
        router.post('/user/transaction', this.postTransaction.bind(this));
        router.get('/user/transaction', this.transactOperation.bind(this));
        router.get('/user/utransaction', this.getTransaction.bind(this));
        router.post('/user/verify-paypal-transaction', this.handlePayment.bind(this));
        /**
         * Bank Account Route
         */
        router.get('/user/bkaccount', this.getAccount.bind(this));
        router.post('/user/bkaccount', this.saveAccount.bind(this));
        /**
         * Bitcoin Wallet Route
         */
        router.get('/user/wallet', this.getWallet.bind(this));
        router.post('/user/wallet', this.saveWallet.bind(this));
        /**
         * Payments Route
         */
        // router.get("/user/payment-success", this.executePayment.bind(this));
        router.post('/user/initialize-payment', this.initiatePayment.bind(this));
        router.get('/user/payment-cancel', this.cancelPayment.bind(this));
        // router.get("/user/successpage", this.serveSuccessView.bind(this));
        /**
         * Order Routes
         */
        router.post('/user/order', this.upload.single('image'), this.createOrder.bind(this));
        // router.get("/user/order", this.getOrderOperation.bind(this));
        // router.post("/user/order", this.processOrder.bind(this));
        /**
         * Miscellenous Route
         */
        router.get('/user/banks', this.fetchBanks.bind(this));
        router.get('/user/bankcode', this.fetchBankCode.bind(this));
        router.get('/user/resolve-account', this.resolveAccount.bind(this));
        router.get('/user/rate', this.getCurrentRate.bind(this));
        router.post('/user/transfer', this.makeTransfer.bind(this));
        router.post('/user/updatepassword', this.updatePassword.bind(this));
        router.post('/user/canmaketransaction', this.canMakeTransaction.bind(this));
        router.get('/user/isbtcset', this.isBitCoinSet.bind(this));
        router.get('/user/isbankaccountset', this.isBankAccountSet.bind(this));
        router.get('/user/authcheck', this.isUserVerified.bind(this));
        router.get('/user/paymentvendors', this.getPaymentVendors.bind(this));
        // router.post(
        //   '/user/payment-verify',
        //   this.handlePaymentVendorCallback.bind(this)
        // );
    }
    serveDashboardView(req, res) {
        res.render('user/store', {
            title: 'Store',
            layout: 'userLayout',
            isStore: true,
            csrfToken: req.csrfToken(),
        });
    }
    serveStoreView(req, res) {
        res.render('user/store', {
            title: 'Store',
            layout: 'userLayout',
            isStore: true,
            csrfToken: req.csrfToken(),
        });
    }
    serveCartView(req, res) {
        console.log(req.user);
        this.user = req.user;
        res.render('user/cart', {
            title: 'Cart',
            layout: 'userLayout',
            isStore: true,
            csrfToken: req.csrfToken(),
        });
    }
    serveCodeView(req, res) {
        console.log('redirected to me');
        res.render('user/codes', {
            title: 'My Codes',
            layout: 'userLayout',
            isCode: true,
            csrfToken: req.csrfToken(),
        });
    }
    serveInvoiceView(req, res) {
        res.render('user/invoice', {
            title: 'Invoice',
            layout: 'userLayout',
            isStore: true,
            csrfToken: req.csrfToken(),
        });
    }
    serveSalesView(req, res) {
        res.render('user/sales', {
            title: 'Sales',
            layout: 'userLayout',
            isSales: true,
            csrfToken: req.csrfToken(),
        });
    }
    serveProfileView(req, res) {
        res.render('user/profile', {
            title: 'Profile',
            layout: 'userLayout',
            isProfile: true,
            csrfToken: req.csrfToken(),
        });
    }
    getActiveCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeGccs = yield this._gcController.getActiveGccs();
            return res.send({
                status: 'read',
                data: activeGccs,
            });
        });
    }
    cartItemOperation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let itemBundle = yield this._userController.getCartItems(req.user);
            // console.log(itemBundle);
            res.send({
                status: 'read',
                data: itemBundle,
            });
        });
    }
    addItemToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gcId, qty } = req.body;
            let saved = yield this._userController.addToCart(gcId, req.user.id, qty);
            res.send({
                status: 'added',
                data: saved,
            });
        });
    }
    clearCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            yield this._userController.clearCart(userId);
            res.send({
                status: 'removed',
                data: true,
            });
        });
    }
    scaffoldcodes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let codeItems = req.body;
            let codes = yield this._userController.scaffoldCodes(codeItems);
            res.send({
                status: 'created',
                data: codes,
            });
        });
    }
    postTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = req.body;
            payload.user = req.user;
            let transaction = yield this._userController.createTransaction(payload);
            res.send({
                status: 'created',
                data: transaction,
            });
        });
    }
    transactOperation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userid = req.user.id;
            if (req.query && req.query.tid) {
                let tid = req.query.tid;
                let transaction = yield this._userController.getUserCodesByTransaction(userid, tid);
                res.send({
                    status: 'read',
                    data: transaction,
                });
            }
            else {
                let transactions = yield this._userController.getUserTransactions(userid);
                res.send({
                    status: 'read',
                    data: transactions,
                });
            }
        });
    }
    getTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userid = req.user.id;
            let transactions = yield this._userController.getUserTransactionsAlone(userid);
            res.send({
                status: 'read',
                data: transactions,
            });
        });
    }
    serveTransactionView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render('user/transaction', {
                title: 'Transactions',
                layout: 'userLayout',
                csrfToken: req.csrfToken(),
                isTransaction: true,
            });
        });
    }
    handlePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            let { orderID, totalAmount } = req.body;
            console.log(orderID);
            console.log(totalAmount);
            let transaction = yield this._payPalService.handleRequest(req.user, orderID, totalAmount);
            if (typeof transaction == 'string') {
                res.send({ status: 'failed', data: transaction });
            }
            res.send({ status: 'success', data: transaction });
        });
    }
    initiatePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            axios_1.default({
                method: 'post',
                url: 'https://api.flutterwave.com/v3/payments',
                data: req.body,
                headers: {
                    Authorization: `Bearer ${config_1.default.secret_key}`,
                },
            })
                .then((data) => {
                console.log(data.data);
                res.json(data.data);
            })
                .catch((err) => console.log(err))
                .finally(() => {
                return true;
            });
        });
    }
    handleTransferCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('called transfer callback');
            let response = req.body.transfer;
            console.log(response);
            let result = yield this._paymentService.handleTransferCallback(response);
            return;
        });
    }
    handlePaymentVendorCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = req.query.status;
            let tx_ref = req.query.tx_ref;
            let transactionId = req.query.transaction_id;
            console.log(`${tx_ref}-${status}-${transactionId}`);
            let user = this.user;
            if (status == 'successful') {
                let transaction = yield this._paymentService.handleUserOrder(user, tx_ref);
                if (typeof transaction == 'string') {
                    res.send({ status: 'failed', data: transaction });
                }
                res.redirect(`/user/my-codes?status=success&transref=${transaction.id}`);
            }
            else {
                res.redirect(`/user/cart?paymentstatus=unknown`);
            }
            //console.log(transaction);
        });
    }
    handlePaymentFailure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.redirect('/user/store?paymentstatus=failed');
        });
    }
    cancelPayment(req, res) {
        res.render('user/payment-confirmation', {
            title: 'Payment',
            layout: 'userLayout',
            isStore: true,
            isPaymentSuccessful: false,
        });
    }
    verifyCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let isPartner = req.user.isPartner;
            let code = req.params.code;
            let gcInDb = yield this._userController.getGCbyCode(code);
            if (isPartner === false) {
                return res.send({
                    status: 'partner'
                });
            }
            if (gcInDb === undefined) {
                return res.send({
                    status: 'invalid',
                });
            }
            else if (gcInDb && gcInDb.isUsed == true) {
                return res.send({
                    status: 'used',
                });
            }
            else if (gcInDb &&
                gcInDb.isUsed == false &&
                gcInDb.isActivated == false) {
                return res.send({
                    status: 'not activated',
                });
            }
            return res.send({
                status: 'valid',
                data: gcInDb,
            });
        });
    }
    removeFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let gccId = req.params.id;
            let userId = req.user.id;
            let result = yield this._userController.removeFromCart(gccId, userId);
            return res.send({
                status: result,
            });
        });
    }
    saveProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { fname, lname, email, phone, country, id } = req.body;
            let userPayload = {
                firstname: fname,
                lastname: lname,
                email: email,
                phone: phone,
                country: country,
                id: id,
            };
            let updatedUser = yield this._userController.saveUser(userPayload);
            return res.send({
                status: 'update',
                data: updatedUser,
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
    fetchBanks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const banks = yield this._paystackService.fetchBanks();
            return res.send({
                status: 'read',
                data: banks,
            });
        });
    }
    fetchBankCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let bankname = req.query.bkname;
            const code = yield this._paystackService.fetchBankCode(bankname);
            return res.send({
                status: 'read',
                data: code,
            });
        });
    }
    resolveAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let accnumber = req.query.accnumber;
            let bankcode = req.query.code;
            const response = yield this._paystackService.resolveAccount(accnumber, bankcode);
            return res.send({
                status: 'read',
                data: response,
            });
        });
    }
    makeTransfer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = req.user;
            let { amount, gcodes } = req.body;
            const response = yield this._paymentService.makeTransfer(user, amount, gcodes);
            console.log(response);
            return res.send({
                status: 'transfer',
                data: response,
            });
        });
    }
    getCurrentRate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this._userController.getActiveRate();
            return res.send({
                status: 'read',
                data: response,
            });
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.file) {
                let filePath = req.file.path;
                let payload = {
                    amount: Number(req.body.amount),
                    user: req.user,
                    receiptPath: filePath,
                };
                let newOrder = yield this._userController.createOrder(payload);
                return res.send({
                    status: 'true',
                    data: newOrder,
                });
            }
            else {
                return res.send({
                    status: 'false',
                    data: 'Receipt is needed as proof of payment',
                });
            }
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this._userController.updatePassword(req.body);
            // console.log(response);
            return res.send({
                status: 'update',
                data: response,
            });
        });
    }
    canMakeTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentAmount = Number(req.body.totalAmount);
            let userId = req.user.id;
            // console.log(currentAmount);
            let response = yield this._tService.canMakeTransaction(userId, currentAmount);
            // console.log(response)
            res.send({
                status: 'read',
                data: response,
            });
        });
    }
    isBitCoinSet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.user.id;
            let wallet = yield this._userController.getWallet(userId);
            res.send({
                status: 'read',
                data: wallet,
            });
        });
    }
    isBankAccountSet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.user.id;
            let account = yield this._userController.getAccount(userId);
            res.send({
                status: 'read',
                data: account,
            });
        });
    }
    isEmailUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEmail = req.body.email;
            let isExist = yield this._userController.isEmailExist(userEmail);
            res.send(!isExist);
        });
    }
    isPhoneUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userPhone = req.body.phone;
            let isExist = yield this._userController.isPhoneExist(userPhone);
            res.send(!isExist);
        });
    }
    isUserVerified(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let uid = req.user.id;
            let verificationStatus = yield this._userController.isUserVerified(uid);
            res.send({
                status: verificationStatus,
            });
        });
    }
    getPaymentVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this._userController.getAllActiveVendors();
            res.send({
                data: response,
            });
        });
    }
}
exports.UserRoute = UserRoute;
//# sourceMappingURL=user.js.map