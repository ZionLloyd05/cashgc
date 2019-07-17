import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn
} from "typeorm";

@Entity()
export class Rate {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public localrate: number;

	@Column()
	public isactive: boolean;

	@CreateDateColumn()
	createdAt?: Date;
}
