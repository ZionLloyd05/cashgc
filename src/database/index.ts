import { TransCartItem } from "../models/TransCartItem";
import { Transaction } from "../models/Transaction";
import { GiftCode } from "../models/GiftCode";
import { CartItem } from "../models/CartItem";
import { Cart } from "../models/Cart";
import { User } from "../models/User";
import { Admin } from "../models/Admin";
import { DatabaseConfiguration } from "./index";
import { Connection, createConnection } from "typeorm";

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
        Cart,
        CartItem,
        GiftCode,
        Transaction,
        TransCartItem
      ],
      synchronize: true
    });

    return this._connection;
  }
}
