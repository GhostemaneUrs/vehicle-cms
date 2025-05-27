import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Project } from '../../projects/entities/project.entity';
import { Role } from './roles.entity';
import { Organizational } from '../../organizational/entities/organizational.entity';
import { Transfer } from '../../transfers/entities/transfer.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable({ name: 'user_projects' })
  projects: Project[];

  @ManyToMany(() => Organizational, (ou) => ou.users)
  @JoinTable({ name: 'user_organizational' })
  organizational: Organizational[];

  @OneToMany(() => Transfer, (t) => t.client)
  clientTransfers: Transfer[];

  @OneToMany(() => Transfer, (t) => t.transmitter)
  transmitterTransfers: Transfer[];
}
