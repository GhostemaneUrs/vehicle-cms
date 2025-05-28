import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Tenancy } from '../../tenancy/entities/tenancy.entity';

export function commonConfigFactory(cfg: ConfigService): DataSourceOptions {
  return {
    type: 'postgres',
    host: cfg.get<string>('config.db.host'),
    port: cfg.get<number>('config.db.port'),
    username: cfg.get<string>('config.db.user'),
    password: cfg.get<string>('config.db.pass'),
    database: cfg.get<string>('config.db.name'),
    schema: 'public',
    synchronize: false,
    logging: false,
    entities: [Tenancy],
  };
}
