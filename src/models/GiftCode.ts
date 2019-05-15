import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
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

  @CreateDateColumn()
  createdAt: Date;
}
