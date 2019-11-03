import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn
} from "typeorm";

enum Category {
	Auto,
	Manual
}

@Entity()
export class PayoutVendor {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public name: string;

	@Column()
	public slug?: string;

	@Column()
	public category: Category;

	@Column({ default: false })
	public isAvailable: boolean;
}
