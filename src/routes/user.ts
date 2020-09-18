import { TransactionService } from './../services/transaction.service';
import { Order } from './../models/Order';
import { UserController } from './../controllers/user.ctrl';
import { GccController } from './../controllers/gcc.ctrl';
import { AuthService } from './../services/auth.service';
import { Router, Request, Response, NextFunction } from 'express';
import { IRoute } from './IRoute';
import * as paypal from 'paypal-rest-sdk';
import DIContainer from '../container/DIContainer';
import * as multer from 'multer';

import * as csurf from 'csurf';
import { PaystackService } from '../services/paystack.service';
import { PayPalService } from '../services/paypal.service';
import config from '../config';
import axios from 'axios';
import { PaymentService } from './../services/payment.service';

export class UserRoute implements IRoute {
  private upload: any;
  private storage: any;
  private user: any;

  constructor() {
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
        } else {
          next(new Error('File not supported'), false);
        }
      },
    });
  }

  private itemTotalAmount: Number = 0;
  private _authService: AuthService = DIContainer.resolve<AuthService>(
    AuthService
  );
  private _gcController: GccController = DIContainer.resolve<GccController>(
    GccController
  );
  private _userController: UserController = DIContainer.resolve<UserController>(
    UserController
  );

  private _tService: TransactionService = DIContainer.resolve<
    TransactionService
  >(TransactionService);

  private _paystackService: PaystackService = DIContainer.resolve<
    PaystackService
  >(PaystackService);

  private _payPalService: PayPalService = DIContainer.resolve<PayPalService>(
    PayPalService
  );

  private _paymentService: PaymentService = DIContainer.resolve<PaymentService>(
    PaymentService
  );

  initialize(router: Router): void {
    router.post('/user/isemailexist', this.isEmailUnique.bind(this));
    router.post('/user/isphoneexist', this.isPhoneUnique.bind(this));
    router.get(
      '/user/pay-callback',
      this.handlePaymentVendorCallback.bind(this)
    );
    router.post(
      '/user/transfer-callback',
      this.handleTransferCallback.bind(this)
    );
    router.get(
      '/user/pay-failed-callback',
      this.handlePaymentFailure.bind(this)
    );

    const csrfProtection = csurf();
    router.use(csrfProtection);

    router.all('/user/*', this._authService.mustBeLoggedIn);
    router.all('/user/*', this._authService.routeGaurd);

    router.get(
      '/user',
      this._authService.mustBeLoggedIn,
      this._authService.routeGaurd,
      this.serveDashboardView.bind(this)
    );

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
    router.post(
      '/user/verify-paypal-transaction',
      this.handlePayment.bind(this)
    );

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
    router.post(
      '/user/order',
      this.upload.single('image'),
      this.createOrder.bind(this)
    );
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

  private serveDashboardView(req: Request, res: Response) {
    res.render('user/store', {
      title: 'Store',
      layout: 'userLayout',
      isStore: true,
      csrfToken: req.csrfToken(),
    });
  }

  private serveStoreView(req: Request, res: Response) {
    res.render('user/store', {
      title: 'Store',
      layout: 'userLayout',
      isStore: true,
      csrfToken: req.csrfToken(),
    });
  }

  private serveCartView(req: Request, res: Response) {
    console.log(req.user);
    this.user = req.user;
    res.render('user/cart', {
      title: 'Cart',
      layout: 'userLayout',
      isStore: true,
      csrfToken: req.csrfToken(),
    });
  }

  private serveCodeView(req: Request, res: Response) {
    console.log('redirected to me');
    res.render('user/codes', {
      title: 'My Codes',
      layout: 'userLayout',
      isCode: true,
      csrfToken: req.csrfToken(),
    });
  }

  private serveInvoiceView(req: Request, res: Response) {
    res.render('user/invoice', {
      title: 'Invoice',
      layout: 'userLayout',
      isStore: true,
      csrfToken: req.csrfToken(),
    });
  }
  private serveSalesView(req: Request, res: Response) {
    res.render('user/sales', {
      title: 'Sales',
      layout: 'userLayout',
      isSales: true,
      csrfToken: req.csrfToken(),
    });
  }

  private serveProfileView(req: Request, res: Response) {
    res.render('user/profile', {
      title: 'Profile',
      layout: 'userLayout',
      isProfile: true,
      csrfToken: req.csrfToken(),
    });
  }

  private async getActiveCategories(req: Request, res: Response) {
    const activeGccs = await this._gcController.getActiveGccs();
    return res.send({
      status: 'read',
      data: activeGccs,
    });
  }

  private async cartItemOperation(req: Request, res: Response) {
    let itemBundle = await this._userController.getCartItems(req.user);
    // console.log(itemBundle);
    res.send({
      status: 'read',
      data: itemBundle,
    });
  }

  private async addItemToCart(req: Request, res: Response) {
    const { gcId, qty } = req.body;
    let saved = await this._userController.addToCart(gcId, req.user.id, qty);
    res.send({
      status: 'added',
      data: saved,
    });
  }

  private async clearCart(req: Request, res: Response) {
    const userId = req.user.id;
    await this._userController.clearCart(userId);
    res.send({
      status: 'removed',
      data: true,
    });
  }

  private async scaffoldcodes(req: Request, res: Response) {
    let codeItems = req.body;
    let codes = await this._userController.scaffoldCodes(codeItems);
    res.send({
      status: 'created',
      data: codes,
    });
  }

  private async postTransaction(req: Request, res: Response) {
    let payload = req.body;
    payload.user = req.user;
    let transaction = await this._userController.createTransaction(payload);
    res.send({
      status: 'created',
      data: transaction,
    });
  }

  private async transactOperation(req: Request, res: Response) {
    let userid = req.user.id;
    if (req.query && req.query.tid) {
      let tid = req.query.tid;
      let transaction = await this._userController.getUserCodesByTransaction(
        userid,
        tid
      );
      res.send({
        status: 'read',
        data: transaction,
      });
    } else {
      let transactions = await this._userController.getUserTransactions(userid);
      res.send({
        status: 'read',
        data: transactions,
      });
    }
  }

  private async getTransaction(req: Request, res: Response) {
    let userid = req.user.id;
    let transactions = await this._userController.getUserTransactionsAlone(
      userid
    );
    res.send({
      status: 'read',
      data: transactions,
    });
  }

  private async serveTransactionView(req: Request, res: Response) {
    res.render('user/transaction', {
      title: 'Transactions',
      layout: 'userLayout',
      csrfToken: req.csrfToken(),
      isTransaction: true,
    });
  }

  private async handlePayment(req: Request, res: Response) {
    console.log(req.body);
    let { orderID, totalAmount } = req.body;
    console.log(orderID);
    console.log(totalAmount);

    let transaction = await this._payPalService.handleRequest(
      req.user,
      orderID,
      totalAmount
    );

    if (typeof transaction == 'string') {
      res.send({ status: 'failed', data: transaction });
    }

    res.send({ status: 'success', data: transaction });
  }

  private async initiatePayment(req: Request, res: Response) {
    console.log(req.body);
    axios({
      method: 'post',
      url: 'https://api.flutterwave.com/v3/payments',
      data: req.body,
      headers: {
        Authorization: `Bearer ${config.secret_key}`,
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
  }

  private async handleTransferCallback(req: Request, res: Response) {
    console.log('called transfer callback');

    let response = req.body.transfer;
    console.log(response);

    let result = await this._paymentService.handleTransferCallback(response);
    return;
  }

  private async handlePaymentVendorCallback(req: Request, res: Response) {
    let tx_ref = req.params.tx_ref;
    console.log(tx_ref);
    let user = this.user;

    let transaction = await this._paymentService.handleUserOrder(user, tx_ref);

    //console.log(transaction);

    if (typeof transaction == 'string') {
      res.send({ status: 'failed', data: transaction });
    }

    res.redirect(`/user/my-codes?transref=${transaction.id}`);
  }

  private async handlePaymentFailure(req: Request, res: Response) {
    res.redirect('/user/store?paymentstatus=failed');
  }

  private cancelPayment(req: Request, res: Response) {
    res.render('user/payment-confirmation', {
      title: 'Payment',
      layout: 'userLayout',
      isStore: true,
      isPaymentSuccessful: false,
    });
  }

  private async verifyCode(req: Request, res: Response) {
    let code = req.params.code;
    let gcInDb = await this._userController.getGCbyCode(code);
    // console.log(gcInDb)
    if (gcInDb === undefined) {
      return res.send({
        status: 'invalid',
      });
    } else if (gcInDb && gcInDb.isUsed == true) {
      return res.send({
        status: 'used',
      });
    } else if (
      gcInDb &&
      gcInDb.isUsed == false &&
      gcInDb.isActivated == false
    ) {
      return res.send({
        status: 'not activated',
      });
    }
    return res.send({
      status: 'valid',
      data: gcInDb,
    });
  }

  private async removeFromCart(req: Request, res: Response) {
    let gccId = req.params.id;
    let userId = req.user.id;
    let result = await this._userController.removeFromCart(gccId, userId);
    return res.send({
      status: result,
    });
  }

  private async saveProfile(req: Request, res: Response) {
    let { fname, lname, email, phone, country, id } = req.body;

    let userPayload = {
      firstname: fname,
      lastname: lname,
      email: email,
      phone: phone,
      country: country,
      id: id,
    };

    let updatedUser = await this._userController.saveUser(userPayload);

    return res.send({
      status: 'update',
      data: updatedUser,
    });
  }

  private async saveAccount(req: Request, res: Response) {
    let account = { ...req.body };

    account.user = req.user.id;

    let newBankacc = await this._userController.saveAccount(account);

    return res.send({
      status: 'save',
      data: newBankacc,
    });
  }

  private async getAccount(req: Request, res: Response) {
    const uacc = await this._userController.getAccount(req.user.id);

    return res.send({
      status: 'read',
      data: uacc,
    });
  }

  private async saveWallet(req: Request, res: Response) {
    let wallet = { ...req.body };

    wallet.user = req.user.id;

    let newWallet = await this._userController.saveWallet(wallet);

    return res.send({
      status: 'save',
      data: newWallet,
    });
  }

  private async getWallet(req: Request, res: Response) {
    const uwallet = await this._userController.getWallet(req.user.id);

    return res.send({
      status: 'read',
      data: uwallet,
    });
  }

  private async fetchBanks(req: Request, res: Response) {
    const banks = await this._paystackService.fetchBanks();
    return res.send({
      status: 'read',
      data: banks,
    });
  }

  private async fetchBankCode(req: Request, res: Response) {
    let bankname = req.query.bkname;
    const code = await this._paystackService.fetchBankCode(bankname);

    return res.send({
      status: 'read',
      data: code,
    });
  }

  private async resolveAccount(req: Request, res: Response) {
    let accnumber = req.query.accnumber;
    let bankcode = req.query.code;

    const response = await this._paystackService.resolveAccount(
      accnumber,
      bankcode
    );

    return res.send({
      status: 'read',
      data: response,
    });
  }

  public async makeTransfer(req: Request, res: Response) {
    let user = req.user;
    let { amount, gcodes } = req.body;

    const response = await this._paymentService.makeTransfer(
      user,
      amount,
      gcodes
    );

    return res.send({
      status: 'transfer',
      data: response,
    });
  }

  public async getCurrentRate(req: Request, res: Response) {
    let response = await this._userController.getActiveRate();

    return res.send({
      status: 'read',
      data: response,
    });
  }

  public async createOrder(req: Request, res: Response) {
    if (req.file) {
      let filePath = req.file.path;
      let payload = {
        amount: Number(req.body.amount),
        user: req.user,
        receiptPath: filePath,
      };

      let newOrder = await this._userController.createOrder(payload);
      return res.send({
        status: 'true',
        data: newOrder,
      });
    } else {
      return res.send({
        status: 'false',
        data: 'Receipt is needed as proof of payment',
      });
    }
  }

  public async updatePassword(req: Request, res: Response) {
    let response = await this._userController.updatePassword(req.body);
    // console.log(response);

    return res.send({
      status: 'update',
      data: response,
    });
  }

  public async canMakeTransaction(req: Request, res: Response) {
    let currentAmount = Number(req.body.totalAmount);
    let userId = req.user.id;

    // console.log(currentAmount);
    let response = await this._tService.canMakeTransaction(
      userId,
      currentAmount
    );
    // console.log(response)
    res.send({
      status: 'read',
      data: response,
    });
  }

  private async isBitCoinSet(req: Request, res: Response) {
    let userId = req.user.id;
    let wallet = await this._userController.getWallet(userId);

    res.send({
      status: 'read',
      data: wallet,
    });
  }

  private async isBankAccountSet(req: Request, res: Response) {
    let userId = req.user.id;
    let account = await this._userController.getAccount(userId);

    res.send({
      status: 'read',
      data: account,
    });
  }

  private async isEmailUnique(req: Request, res: Response) {
    let userEmail = req.body.email;
    let isExist = await this._userController.isEmailExist(userEmail);

    res.send(!isExist);
  }

  private async isPhoneUnique(req: Request, res: Response) {
    let userPhone = req.body.phone;
    let isExist = await this._userController.isPhoneExist(userPhone);

    res.send(!isExist);
  }

  private async isUserVerified(req: Request, res: Response) {
    let uid = req.user.id;

    let verificationStatus = await this._userController.isUserVerified(uid);

    res.send({
      status: verificationStatus,
    });
  }

  private async getPaymentVendors(req: Request, res: Response) {
    let response = await this._userController.getAllActiveVendors();

    res.send({
      data: response,
    });
  }

  // public async getOrderOperation(req: Request, res: Response) {
  // 	if(req.query && req.query.id){
  // 		// get order by Id
  // 	}

  // 	let orders
  // }

  /**
   * Workers' Functions
   */
}
