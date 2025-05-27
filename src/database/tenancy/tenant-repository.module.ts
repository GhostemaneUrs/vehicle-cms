import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { Role } from '../../auth/entities/roles.entity';
import { Permission } from '../../auth/entities/permissions.entity';
import { Project } from '../../projects/entities/project.entity';
import { Organizational } from '../../organizational/entities/organizational.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Transfer } from '../../transfers/entities/transfer.entity';
import { TENANT_CONNECTION } from '../common/database.tokens';

const ENTITIES = [
  User,
  Role,
  Permission,
  Project,
  Organizational,
  Vehicle,
  Transfer,
];

@Module({
  providers: [
    {
      provide: TENANT_CONNECTION,
      scope: Scope.REQUEST,
      inject: [REQUEST],
      useFactory: (req: any) => {
        const ds = req.tenantConnection;
        if (!ds) throw new Error('Tenant connection not found');
        return ds as DataSource;
      },
    },

    ...ENTITIES.map((e) => ({
      provide: getRepositoryToken(e),
      scope: Scope.REQUEST,
      inject: [TENANT_CONNECTION],
      useFactory: (ds: DataSource): Repository<any> => ds.getRepository(e),
    })),
  ],
  exports: [TENANT_CONNECTION, ...ENTITIES.map((e) => getRepositoryToken(e))],
})
export class TenantRepositoryModule {}
