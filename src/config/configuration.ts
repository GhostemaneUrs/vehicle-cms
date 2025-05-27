import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  db: {
    host: process.env.POSTGRES_HOST, // Postgres host
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432, // Postgres port
    user: process.env.POSTGRES_USER, // Postgres user
    pass: process.env.POSTGRES_PASSWORD, // Postgres password
    name: process.env.POSTGRES_DB, // Postgres database name
  },
  jwtSecret: process.env.JWT_SECRET, // JWT signing secret
  port: parseInt(process.env.PORT, 10) || 3000, // Application listening port
  tenancy: process.env.TENANCY as string, // Current tenant identifier (schema)
}));
