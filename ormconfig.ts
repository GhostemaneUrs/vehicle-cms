import { DataSourceOptions } from 'typeorm';
import { commonConfigFactory } from './src/database/common/database.config';
import { ConfigService } from '@nestjs/config';

export default commonConfigFactory(new ConfigService()) as DataSourceOptions;
