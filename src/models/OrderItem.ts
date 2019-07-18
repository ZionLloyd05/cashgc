import { GiftCodeCategory } from "./GiftCodeCategory";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	OneToOne
} from "typeorm";
import { Order } from "./Order";

@Entity()
export class OrderItem {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public quantity: number;

	@ManyToOne(
		type => GiftCodeCategory,
		giftCodeCategory => giftCodeCategory.orderItems
	)
	public giftCodeCategory: GiftCodeCategory;

	@ManyToOne(type => Order, order => order.orderItems)
	public order: Order;

	@CreateDateColumn()
	createdAt?: Date;
	//
}
