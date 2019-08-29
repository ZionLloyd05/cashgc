import { User } from "./User";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn
} from "typeorm";

@Entity()
export class BankAccount {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public name: string;

	@Column()
	public number: string;

	@OneToOne(() => User)
	@JoinColumn()
	public user: User;
}
