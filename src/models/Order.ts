import { Transaction } from "./Transaction";
import { OrderItem } from "./OrderItem";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Generated,
	ManyToOne,
	ManyToMany,
	JoinTable,
	JoinColumn,
	OneToOne,
	OneToMany
} from "typeorm";

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public receiptUrl?: string;

	@Column({
		default: false
	})
	public isProcessed?: boolean;

	@OneToOne(() => Transaction)
	@JoinColumn()
	public transaction: Transaction;

	@OneToMany(type => OrderItem, orderItem => orderItem.order)
	public orderItems?: OrderItem[];

	@CreateDateColumn()
	createdAt?: Date;
}
