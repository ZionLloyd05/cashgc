import { CartItem } from "./CartItem";
import { User } from "./User";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany
} from "typeorm";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(type => User)
  @JoinColumn()
  public user: User;

  @OneToMany(type => CartItem, cartItem => cartItem.cart)
  public cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;
}
