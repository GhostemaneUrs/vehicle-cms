import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';
dotenv.config();

export const PublicDataSourceRuntime = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT!,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  schema: 'public',
  synchronize: false,
  logging: false,
  entities: [Tenancy],
  migrations: [],
});
