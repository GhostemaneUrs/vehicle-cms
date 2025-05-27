import * as Joi from 'joi';

export const validationSchema = Joi.object({
  POSTGRES_HOST: Joi.string().required().description('PostgreSQL server host'),
  POSTGRES_PORT: Joi.number()
    .default(5432)
    .description('PostgreSQL server port'),
  POSTGRES_USER: Joi.string().required().description('Database user name'),
  POSTGRES_PASSWORD: Joi.string()
    .required()
    .description('Database user password'),
  POSTGRES_DB: Joi.string()
    .required()
    .description('Name of the application database'),
  JWT_SECRET: Joi.string()
    .required()
    .description('Secret key to sign JWT tokens'),
  PORT: Joi.number()
    .default(3000)
    .description('Port on which the NestJS server will listen'),
  TENANCY: Joi.string()
    .required()
    .description('Tenant schema name (e.g., "moradela")'),
});
