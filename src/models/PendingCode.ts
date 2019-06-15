import { Transaction } from "./Transaction";
import { GiftCode } from "./GiftCode";
import { User } from "./User";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	ManyToOne
} from "typeorm";

@Entity()
export class PendingCode {
	@PrimaryGeneratedColumn()
	public id?: number;

	@OneToOne(() => GiftCode)
	@JoinColumn()
	public giftCode: GiftCode;

	@ManyToOne(type => User, user => user.pendingCodes)
	public user: User;

	@OneToOne(() => Transaction)
	@JoinColumn()
	public transaction: Transaction;
}
