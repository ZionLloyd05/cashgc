import { Wallet } from "./../models/Wallet";
import { BankAccount } from "../models/BankAccount";
import { Transaction } from "../models/Transaction";
import { GiftCodeCategory } from "../models/GiftCodeCategory";
import { GiftCode } from "../models/GiftCode";
import { CartItem } from "../models/CartItem";
import { User } from "../models/User";
import { Admin } from "../models/Admin";
import { DatabaseConfiguration } from "./index";
import { Connection, createConnection } from "typeorm";
import { Rate } from "../models/Rate";

export interface DatabaseConfiguration {
	type: "mysql";
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	ssl?: boolean;
}

export class DatabaseProvider {
	private static _connection: Connection;
	private static _configuration: DatabaseConfiguration;

	public static configure(configuration: DatabaseConfiguration): void {
		this._configuration = configuration;
	}

	public static async getConnection(): Promise<Connection> {
		if (this._connection) {
			return this._connection;
		}

		if (!this._configuration) {
			throw new Error("DataProvider is not configured yet. ");
		}

		const {
			type,
			host,
			port,
			username,
			password,
			database,
			ssl
		} = this._configuration;
		this._connection = await createConnection({
			type,
			host,
			port,
			username,
			password,
			database,
			extra: { ssl },
			entities: [
				Admin,
				User,
				CartItem,
				GiftCode,
				Transaction,
				GiftCodeCategory,
				BankAccount,
				Wallet,
				Rate
			],
			synchronize: true,
			logging: true
		});

		return this._connection;
	}
}
