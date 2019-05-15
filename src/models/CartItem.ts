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
  @OneToOne(type => GiftCode)
  @JoinColumn()
  public giftCode: GiftCode;

  @Column()
  @ManyToOne(type => Cart, cart => cart.cartItems)
  public cart: Cart;

  @CreateDateColumn()
  createdAt: Date;
}
