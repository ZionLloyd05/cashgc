import { CartItem } from "./CartItem";
import { Transaction } from "./Transaction";
import {
	validate,
	Contains,
	IsInt,
	Length,
	IsEmail,
	IsFQDN,
	IsDate,
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

	@Column()
	public password?: string;

	@Column()
	public utoken?: string;

	@Column("datetime")
	public uTokenExpiryDate?: Date;

	@OneToMany(type => CartItem, cartItem => cartItem.user)
	public cartItems?: CartItem[];

	@OneToMany(type => Transaction, transaction => transaction.user)
	public transactions?: Transaction[];

	@CreateDateColumn()
	createdAt?: Date;
}
