import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Role } from '../../auth/entities/roles.entity';
import { Permission } from '../../auth/entities/permissions.entity';
import { Project } from '../../projects/entities/project.entity';
import { Organizational } from '../../organizational/entities/organizational.entity';
import { Transfer } from '../../transfers/entities/transfer.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

dotenv.config();

export function createTenantDataSourceRuntime(schema: string): DataSource {
  const opts: DataSourceOptions = {
    name: `tenant_${schema}`,
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT!,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    schema,
    synchronize: false,
    logging: false,
    entities: [
      User,
      Role,
      Permission,
      Project,
      Organizational,
      Transfer,
      Vehicle,
    ],
    migrations: [],
  };
  return new DataSource(opts);
}
