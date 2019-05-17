import { Cart } from "./Cart";
import { GiftCode } from "./GiftCode";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
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

  @Column()
  public isInCart: boolean;

  @ManyToOne(type => GiftCode, giftcode => giftcode.cartItems)
  public giftCode: GiftCode;

  @ManyToOne(type => Cart, cart => cart.cartItems)
  public cart: Cart;

  @CreateDateColumn()
  createdAt: Date;
}
