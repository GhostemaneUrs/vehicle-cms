import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  Index,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../auth/entities/user.entity';
import { Transfer } from '../../transfers/entities/transfer.entity';

@Entity('organizational')
@Index('idx_organizational_name', ['name'])
export class Organizational {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Project, (project) => project.organizational, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @ManyToMany(() => User, (user) => user.organizational)
  users: User[];

  @OneToMany(() => Transfer, (t) => t.organizational)
  transfers: Transfer[];
}
