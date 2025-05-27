import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PublicDataSourceRuntime as PublicDataSource } from '../database/public/base-data-source.runtime';
import { createTenantDataSourceRuntime as createTenantDataSource } from '../database/tenancy/data-source.runtime';
import { Tenancy } from './entities/tenancy.entity';

declare global {
  namespace Express {
    interface Request {
      tenant: Tenancy;
      tenantConnection: import('typeorm').DataSource;
    }
  }
}

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    const tn = req.headers['x-tenant-id'] as string;
    if (!tn) {
      throw new BadRequestException('Missing x-tenant-id header');
    }

    if (!PublicDataSource.isInitialized) {
      await PublicDataSource.initialize();
    }

    const tenant = await PublicDataSource.getRepository(Tenancy).findOneBy({
      name: tn,
    });
    if (!tenant) {
      throw new BadRequestException(`Tenant "${tn}" not found`);
    }

    const ds = createTenantDataSource(`t_${tenant.name}`);
    if (!ds.isInitialized) {
      await ds.initialize();
    }

    req.tenant = tenant;
    req.tenantConnection = ds;

    next();
  }
}
