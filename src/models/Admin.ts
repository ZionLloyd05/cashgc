import { User } from "./User";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn
} from "typeorm";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public role: string;

  @OneToOne(() => User)
  @JoinColumn()
  public user: User;
}
