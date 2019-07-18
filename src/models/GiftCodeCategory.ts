import { OrderItem } from "./OrderItem";
import { GiftCode } from "./GiftCode";
import { CartItem } from "./CartItem";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	OneToMany
} from "typeorm";

@Entity()
export class GiftCodeCategory {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public title: string;

	@Column({
		default:
			"https://res.cloudinary.com/decloud23tech/image/upload/v1559007371/placeholder.png"
	})
	public imageUrl?: string;

	@Column("double")
	public sellingPrice: number;

	@Column("double")
	public buyingPrice: number;

	@Column()
	public prefix?: string;

	@Column({ default: true })
	public isAvailable?: boolean;

	@OneToMany(type => GiftCode, giftCode => giftCode.giftCodeCategory)
	public giftCodes?: GiftCode[];

	@OneToMany(type => OrderItem, orderItem => orderItem.giftCodeCategory)
	public orderItems?: OrderItem[];

	@OneToMany(type => CartItem, cartItem => cartItem.giftCodeCategory)
	public cartItems?: CartItem[];

	@CreateDateColumn()
	createdAt?: Date;
}
