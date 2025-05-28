import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';
import { PublicDataSourceRuntime as PublicDataSource } from '../../database/public/base-data-source.runtime';
import { createTenantDataSourceRuntime as createTenantDataSource } from '../../database/tenancy/data-source.runtime';
import { Tenancy } from '../entities/tenancy.entity';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const tn = req.headers['x-tenant-id'] as string;
    if (!tn) throw new BadRequestException('Missing x-tenant-id');

    if (!PublicDataSource.isInitialized) {
      await PublicDataSource.initialize();
    }
    const tenant = await PublicDataSource.getRepository(Tenancy).findOneBy({
      name: tn,
    });
    if (!tenant) throw new BadRequestException(`Tenant "${tn}" not found`);

    const ds = createTenantDataSource(`t_${tenant.name}`);
    if (!ds.isInitialized) {
      await ds.initialize();
    }
    req['tenant'] = tenant;
    req['tenantConnection'] = ds;
    return true;
  }
}
