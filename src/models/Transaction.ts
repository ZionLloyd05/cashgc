import { CartItem } from "./CartItem";
import { User } from "./User";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  Generated,
  ManyToOne
} from "typeorm";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Generated("uuid")
  public reference: number;

  @Column()
  @ManyToOne(type => User, user => user.transactions)
  public user: User;

  @OneToMany(type => CartItem, cartItem => cartItem.cart)
  public cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;
}
