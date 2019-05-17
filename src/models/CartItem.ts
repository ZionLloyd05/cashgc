import { Cart } from "./Cart";
import { GiftCodeCategory } from "./GiftCodeCategory";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne
} from "typeorm";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public quantity: number;

  @Column("double")
  public price: number;

  @ManyToOne(
    type => GiftCodeCategory,
    giftCodeCategory => giftCodeCategory.cartItems
  )
  public giftCodeCategory: GiftCodeCategory;

  @ManyToOne(type => Cart, cart => cart.cartItems)
  public cart: Cart;

  @CreateDateColumn()
  createdAt: Date;
}
