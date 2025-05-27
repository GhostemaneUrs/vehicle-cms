import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tenancy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
  createdAt: Date;
}
