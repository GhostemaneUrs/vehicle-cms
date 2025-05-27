import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transfer } from '../../transfers/entities/transfer.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  plate: string;

  @Column()
  service: string;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Transfer, (t) => t.vehicle)
  transfers: Transfer[];
}
