import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { TenancyModule } from './tenancy/tenancy.module';
import { TenancyMiddleware } from './tenancy/tenancy.middleware';
import { AuthModule } from './auth/auth.module';
import { TenantGuard } from './tenancy/guards/tenant.guard';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { VehicleModule } from './vehicles/vehicle.module';
import { ProjectModule } from './projects/project.module';
import { OrganizationalModule } from './organizational/organizational.module';
import { TransferModule } from './transfers/transfer.module';
import { SharedAuthModule } from './auth/shared-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    TenancyModule,
    AuthModule,
    VehicleModule,
    ProjectModule,
    OrganizationalModule,
    TransferModule,
    SharedAuthModule,
    ThrottlerModule.forRoot([{ ttl: 60, limit: 20 }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenancyMiddleware)
      .exclude(
        { path: 'auth', method: RequestMethod.ALL },
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'tenancy', method: RequestMethod.ALL },
        { path: 'tenancy/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
