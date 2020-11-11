import { injectable } from 'inversify';

import * as _ from 'underscore';
import axios from 'axios';
import config from '../config';
import DIContainer from '../container/DIContainer';
import { GiftCodeService } from './../services/gc.service';
import { UserService } from './user.service';
import { RateService } from './rate.service';
import { TransactionService } from './transaction.service';

@injectable()
export class PaymentService {
  private _gcService: GiftCodeService = DIContainer.resolve<GiftCodeService>(
    GiftCodeService
  );

  private _userService: UserService = DIContainer.resolve<UserService>(
    UserService
  );

  private _rService: RateService = DIContainer.resolve<RateService>(
    RateService
  );

  private _tService: TransactionService = DIContainer.resolve<
    TransactionService
  >(TransactionService);

  private baseUrl;

  private errors;

  constructor() {
    this.baseUrl = 'https://api.flutterwave.com/v3';
    this.errors = [];
  }

  public async handleUserOrder(user: any, transactionReference: any) {
    console.log('handling request');
    console.log(transactionReference);
    try {
      return await this._gcService.scaffoldUserCode(user, transactionReference);
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }

  public async makeTransfer(
    user: any,
    amountToTransfer: number,
    codesToSell: any
  ): Promise<any> {
    let error = '';
    console.log('making transfer initiated');

    // collect user account details
    let userAccount = await this._userService.getAccount(user.id);

    console.log(userAccount);

    if (userAccount && Object.keys(userAccount).length > 0) {
      console.log('trying to fetch data');

      // get bank code
      let bankcode = await this.fetchBankCode(userAccount.name);

      let amountToTransferInNaira = await this._rService.convertDollarToNaira(
        amountToTransfer
      );

      console.log('in maketransfer');

      const { v4: uuidv4 } = require('uuid');

      var transactionRef = uuidv4();

      var transferPayload = {
        account_bank: bankcode,
        account_number: userAccount.number,
        amount: amountToTransferInNaira,
        narration: 'Payment for codes',
        currency: 'NGN',
        beneficiary_name: `${user.firstname} ${user.lastname}`,
        callback_url: 'https://a4f6480f2bf9.ngrok.io/user/transfer-callback',
      };

      console.log(transferPayload);

      const res = await axios({
        method: 'post',
        url: `${this.baseUrl}/transfers`,
        data: transferPayload,
        headers: {
          Authorization: `Bearer ${config.secret_key}`,
        },
      }).catch(function (error) {
        let toReturn = { status: 'failed', data: error };

        return toReturn;
      });

      console.log('got here');
      var response = res.data;
      console.log(response);

      if (response.status == 'success') {
        // save transaction
        let transactionPayload = {
          status: 2,
          type: 1,
          payment: 5,
          user,
          paymentRef: response.data.reference,
          amount: response.data.amount,
          gcodes: codesToSell,
        };

        await this._tService.createTransaction(transactionPayload);

        let toReturn = { status: 'success', data: response };

        console.log(toReturn);

        return toReturn;
      }
    } else {
      error = 'Incorrect account credentials';
      let toReturn = { status: 'failed', data: error };
      return toReturn;
    }
  }

  public async handleTransferCallback(payload: any): Promise<any> {
    //console.log('holla');
    console.log(payload);

    if (payload == null) {
      return false;
    }

    //get transaction by reference
    let transactionInDb = await this._tService.getTransactionByReference(
      payload.reference
    );

    console.log(transactionInDb);

    if (payload.status == 'FAILED') {
      //get transaction
      transactionInDb.message = payload.complete_message;

      console.log(transactionInDb);
      //update transaction status
      await this._tService.updateTransfer(transactionInDb);
    } else if (payload.status == 'SUCCESS') {
      transactionInDb.status = 0;

      console.log(transactionInDb);
      await this._tService.updateTransfer(transactionInDb);
    }

    return;
  }

  public async resolveAccount(
    accnumber: string,
    bankcode: string
  ): Promise<any> {
    console.log('resolving account');
    let res_error = '';
    const res = await axios({
      method: 'GET',
      responseType: 'json',
      url: `${this.baseUrl}/bank/resolve?account_number=${accnumber}&bank_code=${bankcode}`,
      headers: {
        Authorization: 'Bearer ' + config.secret_key,
      },
    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        res_error = 'Incorrect account credentials';
      } else if (error.request) {
        res_error = 'No internet connection';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        res_error = error.message;
      }
    });
    res_error && console.log(res_error);
    if (res_error == '') return res;
    else return res_error;
  }

  public async fetchBankCode(bankname: string): Promise<any> {
    console.log('fetching bank codes');

    console.log(config.secret_key);

    let banks;

    let response = await axios.get(`${this.baseUrl}/banks/NG`, {
      headers: {
        Authorization: `Bearer ${config.secret_key}`,
        'Access-Control-Allow-Origin': '*',
      },
    });
    banks = response.data.data;

    let bank = _.find(banks, function (bank) {
      if (bank.name.includes(bankname)) {
        return bank;
      }
    });

    return bank.code;
  }
}
