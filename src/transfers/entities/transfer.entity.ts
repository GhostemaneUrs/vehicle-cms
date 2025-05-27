import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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
  vehicle: Vehicle;

  @ManyToOne(() => User, (u) => u.clientTransfers, { eager: true })
  client: User;

  @ManyToOne(() => User, (u) => u.transmitterTransfers, { eager: true })
  transmitter: User;

  @ManyToOne(() => Project, (p) => p.transfers)
  project: Project;

  @ManyToOne(() => Organizational, (ou) => ou.transfers)
  organizational: Organizational;
}
