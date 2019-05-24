import { User } from "./User";
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
  public id?: number;

  @Column()
  public quantity: number;

  @Column("double")
  public total: number;

  @ManyToOne(
    type => GiftCodeCategory,
    giftCodeCategory => giftCodeCategory.cartItems
  )
  public giftCodeCategory: GiftCodeCategory;

  @ManyToOne(type => User, user => user.cartItems)
  public user: User;

  @CreateDateColumn()
  createdAt?: Date;
}
