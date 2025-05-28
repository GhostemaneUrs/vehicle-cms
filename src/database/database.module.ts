import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TenantConnectionProvider } from './tenancy/tenant-connection.provider';
import { TENANT_CONNECTION } from './common/database.tokens';
import { Tenancy } from '../tenancy/entities/tenancy.entity';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const dbPass = cfg.get<string>('config.db.pass');
        return {
          type: 'postgres',
          host: cfg.get<string>('config.db.host'),
          port: cfg.get<number>('config.db.port'),
          username: cfg.get<string>('config.db.user'),
          password: dbPass,
          database: cfg.get<string>('config.db.name'),
          schema: 'public',
          entities: [Tenancy],
          synchronize: false,
          logging: false,
          migrationsTableName: 'migrations',
          migrations: ['dist/database/general-migrations/*.js'],
        };
      },
    }),
    TypeOrmModule.forFeature([Tenancy]),
  ],
  providers: [TenantConnectionProvider],
  exports: [TypeOrmModule, TENANT_CONNECTION],
})
export class DatabaseModule {}
