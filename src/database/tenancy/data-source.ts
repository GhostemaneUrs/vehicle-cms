// src/database/tenancy/data-source.ts
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as glob from 'glob';
import { join, resolve } from 'path';
dotenv.config();

export function createTenantDataSource(
  schema: string,
  includeMigrations = false,
): DataSource {
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
    migrations: includeMigrations
      ? [
          join(process.cwd(), `src/database/migrations/${schema}/*.{ts,js}`),
          join(process.cwd(), `dist/database/migrations/${schema}/*.js`),
        ]
      : [],
    migrationsTableName: 'migrations',
  };
  return new DataSource(opts);
}
