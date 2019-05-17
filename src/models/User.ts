import { Transaction } from "./Transaction";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany
} from "typeorm";

export interface IUserDTO {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

@Entity()
export class User implements IUserDTO {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public firstname: string;

  @Column()
  public lastname: string;

  @Column({
    unique: true
  })
  public email: string;

  @Column()
  public address: string;

  @Column()
  public city: string;

  @Column()
  public state: string;

  @Column()
  public country: string;

  @Column({ default: false })
  public isVerified?: boolean;

  @Column()
  public resetPasswordToken?: string;

  @Column()
  public resetPasswordExpiryDate?: string;

  @Column()
  public password: string;

  @OneToMany(type => Transaction, transaction => transaction.user)
  public transactions?: Transaction[];

  @CreateDateColumn()
  createdAt?: Date;
}
