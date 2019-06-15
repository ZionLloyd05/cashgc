import { User } from "./User";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn
} from "typeorm";

@Entity()
export class External {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public receipent_code: string;

	@OneToOne(() => User)
	@JoinColumn()
	public user: User;
}
