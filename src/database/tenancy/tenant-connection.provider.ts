import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { createTenantDataSourceRuntime } from './data-source.runtime';
import { TENANT_CONNECTION } from '../common/database.tokens';

export const TenantConnectionProvider: Provider = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: async (req: any) => {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) throw new Error('Missing x-tenant-id header');
    const ds = createTenantDataSourceRuntime(`t_${tenantId}`);
    await ds.initialize();
    return ds;
  },
};
