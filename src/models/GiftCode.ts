import { CartItem } from "./CartItem";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany
} from "typeorm";

@Entity()
export class GiftCode {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public imageUrl: string;

  @Column("double")
  public sellingPrice: number;

  @Column("double")
  public buyingPrice: number;

  @Column()
  public prefix: string;

  @OneToMany(type => CartItem, cartItem => cartItem.giftCode)
  public cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;
}
