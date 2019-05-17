import { GiftCodeCategory } from "./GiftCodeCategory";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Column
} from "typeorm";

@Entity()
export class GiftCode {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public code: string;

  @Column({ default: false })
  public isUsed: boolean;

  @Column()
  public dateUsed?: Date;

  @ManyToOne(
    type => GiftCodeCategory,
    giftCodeCategory => giftCodeCategory.giftCodes
  )
  public giftCodeCategory: GiftCodeCategory;

  @CreateDateColumn()
  createdAt: Date;
}
