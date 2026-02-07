import { UserRole } from 'src/enums/user-role.enum';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './Task';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Index()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @OneToMany(() => Task, (task) => task.assignedTo)
  task: Task[];

  @Column({ nullable: true })
  authStrategy: string;

  @Column({ nullable: true })
  refreshToken?: string;
}
