import { OrderItem } from "./../models/OrderItem";
import { injectable } from "inversify";
import { DatabaseProvider } from "./../database/index";

@injectable()
export class OrderItemService {
	public async create(orderItemPayload): Promise<any> {
		const db = await DatabaseProvider.getConnection();
		const orderItemRepo = db.getRepository(OrderItem);

		let newOrderItem = new OrderItem();

		newOrderItem = { ...orderItemPayload };

		return await orderItemRepo.save(newOrderItem);
	}

	public async getOrderItemsByOrder(orderId: number): Promise<any> {
		const db = await DatabaseProvider.getConnection();

		let orderItems = await db
			.getRepository(OrderItem)
			.createQueryBuilder("orderitem")
			.innerJoinAndSelect(
				"orderitem.giftCodeCategory",
				"gcc",
				"orderitem.giftCodeCategory = gcc.id"
			)
			.where({ order: orderId })
			.orderBy({
				"orderitem.id": "DESC"
			})
			.getMany();

		return orderItems;
	}
}
