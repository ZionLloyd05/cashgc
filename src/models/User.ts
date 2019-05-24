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
  address: string;
  city: string;
  state: string;
  country: string;
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
  @Min(10)
  @Max(60)
  public address: string;

  @Column()
  @Max(20)
  public city: string;

  @Column()
  @Max(20)
  public state: string;

  @Column()
  @Max(20)
  public country: string;

  @Column({ default: false })
  public isVerified?: boolean;

  @Column()
  public resetPasswordToken?: string;

  @Column()
  public resetPasswordExpiryDate?: string;

  @Column()
  public password?: string;

  @OneToMany(type => CartItem, cartItem => cartItem.user)
  public cartItems?: CartItem[];

  @OneToMany(type => Transaction, transaction => transaction.user)
  public transactions?: Transaction[];

  @CreateDateColumn()
  createdAt?: Date;
}
