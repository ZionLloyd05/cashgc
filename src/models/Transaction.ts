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
	Failed
}

enum Type {
	Buy,
	Sell
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

	@ManyToOne(type => User, user => user.transactions)
	public user: User;

	@Column("enum", { enum: Type })
	public type: Type;

	@ManyToMany(type => GiftCode)
	@JoinTable()
	public giftCodes: GiftCode[];

	@CreateDateColumn()
	createdAt?: Date;
}
