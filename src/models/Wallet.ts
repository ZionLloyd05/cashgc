import { User } from "./User";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn
} from "typeorm";

@Entity()
export class Wallet {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public wid: string;

	@OneToOne(() => User)
	@JoinColumn()
	public user: User;
}
