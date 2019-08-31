import { RateService } from "./rate.service";
import { TransactionService } from "./transaction.service";
import { UserService } from "./user.service";
import { injectable } from "inversify";
import config from "../config";
import axios from "axios";
import * as _ from "underscore";
import DIContainer from "../container/DIContainer";

@injectable()
export class PaystackService {
	private _userService: UserService = DIContainer.resolve<UserService>(
		UserService
	);

	private _tService: TransactionService = DIContainer.resolve<
		TransactionService
	>(TransactionService);

	private _rService: RateService = DIContainer.resolve<RateService>(
		RateService
	);
	private baseUrl;

	private errors;

	constructor() {
		this.baseUrl = "https://api.paystack.co";
		this.errors = [];
	}

	public async fetchBanks(): Promise<any> {
		let banks;
		const header = `Authorization: Bearer ${config.secret_key}`;
		let response = await axios.get(`${this.baseUrl}/bank`, {
			headers: { header }
		});
		banks = response.data.data;

		return banks;
	}

	public async fetchBankCode(bankname: string): Promise<any> {
		let banks;
		const header = `Authorization: Bearer ${config.secret_key}`;
		let response = await axios.get(`${this.baseUrl}/bank`, {
			headers: { header }
		});
		banks = response.data.data;
		let bank = _.find(banks, function(bank) {
			if (bank.name.includes(bankname)) {
				return bank;
			}
		});

		return bank.code;
	}

	public async resolveAccount(
		accnumber: string,
		bankcode: string
	): Promise<any> {
		// console.log(config.secret_key);
		// console.log(accnumber + " " + bankcode);
		let res_error = "";
		const res = await axios({
			method: "GET",
			responseType: "json",
			url: `${this.baseUrl}/bank/resolve?account_number=${accnumber}&bank_code=${bankcode}`,
			headers: {
				Authorization: "Bearer " + config.secret_key
			}
		}).catch(function(error) {
			if (error.response) {
				console.log(error.response.data);
				console.log(error.response.status);
				res_error = "Incorrect account credentials";
			} else if (error.request) {
				res_error = "No internet connection";
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("Error", error.message);
				res_error = error.message;
			}
		});
		res_error && console.log(res_error);
		if (res_error == "") return res;
		else return res_error;
	}

	// 	"type": "nuban",
	//    "name": "Account 1029",
	//    "description": "Customer1029 bank account",
	//    "account_number": "01000000010",
	//    "bank_code": "044",
	//    "currency": "NGN",
	public async createReceipt(accPayload: any): Promise<any> {
		console.log(config.secret_key);
		const res = await axios.post(
			`${this.baseUrl}/transferrecipient`,
			accPayload,
			{
				headers: { Authorization: "Bearer " + config.secret_key }
			}
		);

		return res.data;
	}

	// {"source": "balance", "reason": "Holiday Flexing", "amount":3794800, "recipient": "RCP_gx2wn530m0i3w3m"}'
	public async initiateTransfer(transferPayload: any): Promise<any> {
		let res_error = "";
		const res = await axios
			.post(`${this.baseUrl}/transfer`, transferPayload, {
				headers: { Authorization: "Bearer " + config.secret_key }
			})
			.catch(function(error) {
				if (error.response) {
					res_error = "Your balance is not enough to fulfil this request";
				} else if (error.request) {
					res_error = "No internet connection";
					return error.request;
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log("Error", error.message);
				}
			});
		res_error && console.log(res_error);
		if (res_error == "") return res.data;
		else return res_error;
	}

	public nairaToKobo(amountInNaira: number): number {
		return amountInNaira * 100;
	}

	public log(message: any) {
		console.log(message);
	}

	public async makeTransfer(
		user: any,
		amountToTransfer: number,
		codesToSell: any
	): Promise<any> {
		let error = "";
		// collect user account details
		let userAccount = await this._userService.getAccount(user.id);

		this.log(userAccount);

		if (userAccount && Object.keys(userAccount).length > 0) {
			// get bank code
			let bankcode = await this.fetchBankCode(userAccount.name);

			this.log(bankcode);

			// verify user's account a.k.a resolving account
			let resolveResponse = await this.resolveAccount(
				userAccount.number,
				bankcode
			);

			if (typeof resolveResponse == "string") {
				error = "Incorrect account credentials";
				return { status: "failed", data: error };
			}

			// this.log(resolveResponse);

			if (resolveResponse.data && resolveResponse.data.status == true) {
				let { account_name, account_number } = resolveResponse.data.data;

				// create a transfer reciept
				let recieptPayload = {
					type: "nuban",
					name: account_name,
					account_number: account_number,
					bank_code: bankcode,
					currency: "NGN"
				};

				let recieptResponse = await this.createReceipt(recieptPayload);

				this.log(recieptResponse);

				if (recieptResponse.status && recieptResponse.status == true) {
					// initiate a transfer
					let amountToTransferInNaira = await this._rService.convertDollarToNaira(
						amountToTransfer
					);
					let amountInKobo = this.nairaToKobo(amountToTransferInNaira);

					let transferPayload = {
						source: "balance",
						amount: amountInKobo,
						recipient: recieptResponse.data.recipient_code
					};
					console.log("about to initiate transfer");
					let transferResponse = await this.initiateTransfer(transferPayload);

					if (typeof transferResponse == "string") {
						error = "Kindly contact the admin";
						return { status: "failed", data: error };
					}

					console.log("Transfer initiated");
					if (transferResponse.status && transferResponse.status == true) {
						let amountInNaira = await this._rService.convertDollarToNaira(
							amountToTransfer
						);

						// save transaction
						let transactionPayload = {
							status: 0,
							type: 1,
							payment: 1,
							user,
							paymentRef: transferResponse.data.transfer_code,
							amount: amountInNaira,
							gcodes: codesToSell
						};

						await this._tService.createTransaction(transactionPayload);

						return { status: "success", data: transferResponse };
					}
				} else {
					error = "Unable to create transfer reciept";
					return { status: "failed", data: error };
				}
			} else {
				error = "Incorrect account credentials";
				return { status: "failed", data: error };
			}
		} else {
			error = "No account for user";
			return { status: "failed", data: error };
		}
	}
}
