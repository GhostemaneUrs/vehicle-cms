import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  Index,
} from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { Organizational } from '../../organizational/entities/organizational.entity';
import { Transfer } from '../../transfers/entities/transfer.entity';

@Entity('projects')
@Index('idx_project_name', ['name'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Organizational, (ou) => ou.project)
  organizational: Organizational[];

  @ManyToMany(() => User, (user) => user.projects)
  users: User[];

  @OneToMany(() => Transfer, (t) => t.project)
  transfers: Transfer[];
}
