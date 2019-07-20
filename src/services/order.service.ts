import { GiftCodeService } from "./gc.service";
import { RateService } from "./rate.service";
import { OrderItemService } from "./orderItem.service";
import { UserService } from "./user.service";
import { TransactionService } from "./transaction.service";
import { Order } from "./../models/Order";
import { DatabaseProvider } from "./../database/index";
import { injectable } from "inversify";
import * as cloudinary from "cloudinary";
import config from "../config";
import DIContainer from "../container/DIContainer";

@injectable()
export class OrderService {
	private cloudinary: any;

	constructor() {
		this.cloudinary = cloudinary.config({
			cloud_name: config.cloudName,
			api_key: config.apiKey,
			api_secret: config.apiSecret
		});
	}

	private _tService: TransactionService = DIContainer.resolve<
		TransactionService
	>(TransactionService);

	private _userService: UserService = DIContainer.resolve<UserService>(
		UserService
	);

	private _rService: RateService = DIContainer.resolve<RateService>(
		RateService
	);

	private _gcService: GiftCodeService = DIContainer.resolve<GiftCodeService>(
		GiftCodeService
	);

	private _oItemService: OrderItemService = DIContainer.resolve<
		OrderItemService
	>(OrderItemService);

	public async create(orderPayload, filePath): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		const orderRepo = db.getRepository(Order);

		let newOrder = new Order();
		console.log("here");
		if (filePath != null && filePath != "") {
			console.log("in");
			/**
			 * Wrap in a try catch so app doesn't crash
			 * when cloudinary service is temporarily down
			 */
			let receiptUrl;

			try {
				receiptUrl = await this.uploadImage(filePath);
			} catch (error) {
				return error;
			}

			newOrder = { ...orderPayload };
			newOrder.receiptUrl = receiptUrl;

			return await orderRepo.save(newOrder);
		} else {
			console.log("not in");
			let error = "Receipt of payment is required to create an order";
			return error;
		}
	}

	public async scaffoldOrder(payload: any): Promise<any> {
		// create transaction

		let amountInNaira = await this._rService.convertDollarToNaira(
			payload.amount
		);

		console.log(amountInNaira);

		let transactionPayload = {
			status: 2,
			type: 0,
			payment: 3,
			amount: amountInNaira,
			user: payload.user
		};

		let newTransaction = await this._tService.createTransaction(
			transactionPayload
		);

		// create order
		let orderPayload = {
			transaction: newTransaction
		};

		let newOrderResponse = await this.create(orderPayload, payload.receiptPath);

		if (typeof newOrderResponse === "string") {
			return newOrderResponse;
		}

		// create order items
		// get current user cart item
		let currentUserCart = await this._userService.getCartItem(payload.user);
		let { items } = currentUserCart;

		items.forEach(async item => {
			let orderItemPayload = {
				giftCodeCategory: item.giftCodeCategory,
				order: newOrderResponse.id,
				quantity: item.quantity
			};

			await this._oItemService.create(orderItemPayload);

			// clear cart items
			await this._userService.clearCart(payload.user.id);
		});

		// clear user cart item

		return "true";
	}

	public async getById(id: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		const orders = await db
			.getRepository("order")
			.createQueryBuilder("order")
			.innerJoinAndSelect("order.transaction", "transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.innerJoinAndSelect("order.orderItems", "orderItems")
			.innerJoinAndSelect("orderItems.giftCodeCategory", "giftCodeCategory")
			.where({ id: id })
			.getOne();

		return orders;
	}

	public async getAll(): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		let orders = await db
			.getRepository("order")
			.createQueryBuilder("order")
			.innerJoinAndSelect("order.transaction", "transaction")
			.innerJoinAndSelect("transaction.user", "user")
			.orderBy({
				"order.id": "DESC"
			})
			.getMany();

		return orders;
	}

	public async setOrderProcessToTrue(orderId: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const orderRepo = db.getRepository(Order);

		let orderInDb = await this.getById(orderId);

		if (orderInDb.isProcessed == false) orderInDb.isProcessed = true;
		else return "Order has already been processed";

		return await orderRepo.save(orderInDb);
	}

	public async uploadImage(filePath: any): Promise<string> {
		const result = await cloudinary.uploader.upload(filePath);
		return result.url;
	}

	public async processOrder(orderId: number, user: any): Promise<any> {
		// get order
		let order = await this.getById(orderId);
		console.log(order);

		// set order isProcess == true
		let response = await this.setOrderProcessToTrue(orderId);
		console.log(response);

		if (typeof response === "string") {
			return response;
		}

		try {
			// set transaction status == success
			await this._tService.setTransactionStatusToSuccess(order.transaction.id);

			// generate codes
			// get cart item
			let cartItem = [];

			let orderItem = await this._oItemService.getOrderItemsByOrder(orderId);

			let genCodes = await this._gcService.generateCodes(orderItem);

			await this._tService.updateTransactionWithGcodes(
				genCodes,
				order.transaction.id
			);

			let updatedOrder = await this.getById(orderId);

			return updatedOrder;
		} catch (error) {
			return error;
		}
	}
}
