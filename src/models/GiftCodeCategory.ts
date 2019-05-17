import { GiftCode } from "./GiftCode";
import { CartItem } from "./CartItem";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany
} from "typeorm";

@Entity()
export class GiftCodeCategory {
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
  public prefix?: string;

  @OneToMany(type => GiftCode, giftCode => giftCode.giftCodeCategory)
  public giftCodes: GiftCode[];

  @OneToMany(type => CartItem, cartItem => cartItem.giftCodeCategory)
  public cartItems?: CartItem[];

  @CreateDateColumn()
  createdAt?: Date;
}
