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

  @Column({ name: 'refresh_token_hash', nullable: true })
  refreshTokenHash: string;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable({
    name: 'user_projects',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'project_id' },
  })
  projects: Project[];

  @ManyToMany(() => Organizational, (ou) => ou.users)
  @JoinTable({
    name: 'user_organizational',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'organizational_id' },
  })
  organizational: Organizational[];

  @OneToMany(() => Transfer, (t) => t.client)
  clientTransfers: Transfer[];

  @OneToMany(() => Transfer, (t) => t.transmitter)
  transmitterTransfers: Transfer[];
}
