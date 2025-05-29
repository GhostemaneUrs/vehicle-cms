import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { User } from '../../auth/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Organizational } from '../../organizational/entities/organizational.entity';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @Column()
  type: string;

  @ManyToOne(() => Vehicle, (v) => v.transfers, { eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => User, (u) => u.clientTransfers, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => User, (u) => u.transmitterTransfers, { eager: true })
  @JoinColumn({ name: 'transmitter_id' })
  transmitter: User;

  @ManyToOne(() => Project, (p) => p.transfers)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Organizational, (ou) => ou.transfers)
  @JoinColumn({ name: 'organizational_id' })
  organizational: Organizational;
}
