import { injectable } from "inversify";
import config from "../config";
import axios from "axios";
import * as _ from "underscore";

@injectable()
export class PaystackService {
	private baseUrl;

	constructor() {
		this.baseUrl = "https://api.paystack.co";
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
		const header = `Authorization: Bearer ${config.secret_key}`;
		
		const res = await axios
			.get(`${this.baseUrl}/bank/resolve?account_number=${accnumber}&bank_code=${bankcode}`,
				{
					headers: { 'Authorization': 'Bearer ' + config.secret_key }
				}
			);
		
		return res.data
	}

// 	"type": "nuban",
//    "name": "Account 1029",
//    "description": "Customer1029 bank account",
//    "account_number": "01000000010",
//    "bank_code": "044",
//    "currency": "NGN",
	public async createReceipt(accPayload: any): Promise<any> {

		const res = await axios.post(`${this.baseUrl}/transferrecipient`, accPayload, {
			headers: { 'Authorization': 'Bearer ' + config.secret_key }
		})

		return res.data;
	}
	
	// {"source": "balance", "reason": "Holiday Flexing", "amount":3794800, "recipient": "RCP_gx2wn530m0i3w3m"}'
	public async initiateTransfer(transferPayload: any): Promise<any> {
		const res = await axios.post(`${this.baseUrl}/transfer`, transferPayload, {
			headers: { 'Authorization': 'Bearer ' + config.secret_key }
		})

		return res.data;
	}

	public async makeTransfer(): Promise<any> {
		// collect user account details

		// verify user's account

		// create a transfer reciept

		// initiate a transfer
	}
}
