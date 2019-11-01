import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn
} from "typeorm";

@Entity()
export class PayoutVendor {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public name: string;

	@Column()
	public slug: string;

	@Column({ default: false })
	public isAvailable: boolean;
}
