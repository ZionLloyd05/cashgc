import { User } from "./User";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";

@Entity()
export class Admin extends User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public role: string;
}
