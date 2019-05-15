import { GiftCode } from "./GiftCode";
import { Transaction } from "./Transaction";
import { CartItem } from "./CartItem";
import { User } from "./User";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  ManyToMany,
  JoinTable
} from "typeorm";

@Entity()
export class UserGiftCode {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @OneToOne(type => Transaction)
  @JoinColumn()
  public transaction: Transaction;

  @Column()
  @ManyToOne(type => User, user => user.userGiftCodes)
  public user: User;

  @ManyToMany(type => GiftCode)
  @JoinTable()
  public giftCodes: GiftCode[];

  @Column()
  public quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
