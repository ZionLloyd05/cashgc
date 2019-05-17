import { User } from "./User";
import { TransCartItem } from "./TransCartItem";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  Generated,
  ManyToOne
} from "typeorm";

enum Status {
  Success,
  Failed
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Generated("uuid")
  public reference: number;

  @Column("enum", { enum: Status })
  public status: Status;

  @ManyToOne(type => User, user => user.transactions)
  public user: User;

  @OneToMany(type => TransCartItem, transCartItem => transCartItem.transaction)
  public transCartItems: TransCartItem[];

  @CreateDateColumn()
  createdAt: Date;
}
