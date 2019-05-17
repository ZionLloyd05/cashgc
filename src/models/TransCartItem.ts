import { Transaction } from "./Transaction";
import { CartItem } from "./CartItem";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from "typeorm";

@Entity()
export class TransCartItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(type => CartItem)
  @JoinColumn()
  public cartItem: CartItem;

  @ManyToOne(type => Transaction, transaction => transaction.transCartItems)
  public transaction: Transaction;

  @CreateDateColumn()
  createdAt: Date;
}
