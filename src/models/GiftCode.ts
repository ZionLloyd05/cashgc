import { Transaction } from "./Transaction";
import { GiftCodeCategory } from "./GiftCodeCategory";
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	Column,
	ManyToMany,
	Unique
} from "typeorm";

@Entity()
@Unique(["code"])
export class GiftCode {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public code: string;

	@Column({ default: false })
	public isUsed: boolean;

	@Column({ default: "1990-10-10 10:00:00"})
	public dateUsed?: Date;

	@Column({ default: false })
	public isActivated: boolean;

	@ManyToMany(type => Transaction)
	public transactions?: Transaction[];

	@ManyToOne(
		type => GiftCodeCategory,
		giftCodeCategory => giftCodeCategory.giftCodes
	)
	public giftCodeCategory: GiftCodeCategory;

	@CreateDateColumn()
	createdAt: Date;
}
