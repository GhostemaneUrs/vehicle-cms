import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as glob from 'glob';
import { resolve, join } from 'path';
dotenv.config();

export function createTenantDataSource(
  schema: string,
  includeMigrations = false,
): DataSource {
  const baseMigrationsDir = resolve(__dirname, '../../database/migrations');
  const migrationFiles = includeMigrations
    ? glob.sync(join(baseMigrationsDir, schema, '*.{ts,js}'))
    : [];

  console.log(`→ Cargando migraciones para ${schema}:`, migrationFiles);

  const opts: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT!,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    schema,
    synchronize: false,
    logging: false,
    entities: glob.sync(resolve(__dirname, '../../**/*.entity.{ts,js}')),
    migrations: migrationFiles,
    migrationsTableName: 'migrations',
  };
  return new DataSource(opts);
}
