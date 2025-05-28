import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { join, resolve } from 'path';
import * as glob from 'glob';
dotenv.config();

const allEntityFiles = glob.sync(
  resolve(__dirname, '../../**/*.entity.{ts,js}'),
);

const tenancyEntityFiles = allEntityFiles.filter((f) =>
  /tenancy[\/\\]entities[\/\\].*\.entity\.(ts|js)$/.test(f),
);

export const PublicDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT!,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  schema: 'public',
  synchronize: false,
  logging: false,
  entities: tenancyEntityFiles,
  migrations: [
    join(process.cwd(), 'src/database/general-migrations/*.{ts,js}'),
  ],
  migrationsTableName: 'migrations',
});
