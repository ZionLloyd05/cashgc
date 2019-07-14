import { User } from "./User";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Generated,
	ManyToOne,
	ManyToMany,
	JoinTable
} from "typeorm";
import { GiftCode } from "./GiftCode";

enum Status {
	Success,
	Failed,
	Pending
}

enum Type {
	Buy,
	Sell
}

enum Payment {
	Paypal,
	Paystack,
	Bitcoin
}

@Entity()
export class Transaction {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	@Generated("uuid")
	public reference?: number;

	@Column("enum", { enum: Status })
	public status: Status;

	@Column("enum", { enum: Payment })
	public payment: Payment;

	@ManyToOne(type => User, user => user.transactions)
	public user: User;

	@Column("enum", { enum: Type })
	public type: Type;

	@Column()
	public paymentRef?: String;

	@ManyToMany(type => GiftCode)
	@JoinTable()
	public giftCodes?: GiftCode[];

	@CreateDateColumn()
	createdAt?: Date;
}
