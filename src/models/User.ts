import { UserGiftCode } from "./UserGiftCode";
import { Transaction } from "./Transaction";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstname: string;

  @Column()
  public lastname: string;

  @Column({
    unique: true
  })
  public email: string;

  //   @Column()
  //   public address: string;

  //   @Column()
  //   public country: string;

  //   @Column()
  //   public isVerfied: boolean;

  //   @Column()
  //   public resetPasswordToken: string;

  //   @Column()
  //   public resetPasswordExpiryDate: string;

  @Column()
  @OneToMany(type => UserGiftCode, userGiftCode => userGiftCode.user)
  public userGiftCodes: UserGiftCode[];

  @Column()
  @OneToMany(type => Transaction, transaction => transaction.user)
  public transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;
}
