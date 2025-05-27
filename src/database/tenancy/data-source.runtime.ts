import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as glob from 'glob';
import { resolve } from 'path';

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
    entities: glob.sync(resolve(__dirname, '../../**/*.entity.{js,ts}')),
    migrations: [],
  };
  return new DataSource(opts);
}
