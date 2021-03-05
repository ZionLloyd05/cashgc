import { CartItem } from "./CartItem";
import { Transaction } from "./Transaction";
import {
	IsEmail,
	Min,
	Max
} from "class-validator";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	OneToMany
} from "typeorm";

export interface IUserDTO {
	id?: number;
	firstname: string;
	lastname: string;
	email: string;
	phone: string;

	country: string;

	isVerified?: boolean;
	isPartner?: boolean;
}

@Entity()
export class User implements IUserDTO {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	@Min(3)
	@Max(30)
	public firstname: string;

	@Column()
	@Min(3)
	@Max(30)
	public lastname: string;

	@Column({
		unique: true
	})
	@IsEmail()
	public email: string;

	@Column()
	public phone: string;

	@Column()
	@Max(20)
	public country: string;

	@Column({ default: false })
	public isVerified?: boolean;

	@Column({ default: false })
	public isPartner?: boolean;

	@Column()
	public password?: string;

	@Column({ default: "nil" })
	public utoken?: string;

	@Column({ default: "1990-10-10 10:00:00" })
	public uTokenExpiryDate?: Date;

	@OneToMany(
		() => CartItem,
		cartItem => cartItem.user
	)
	public cartItems?: CartItem[];

	@OneToMany(
		() => Transaction,
		transaction => transaction.user
	)
	public transactions?: Transaction[];

	@CreateDateColumn()
	createdAt?: Date;
}
