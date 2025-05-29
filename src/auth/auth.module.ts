import { Module, Scope } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { RolesService } from './services/roles.service';
import { PermissionsService } from './services/permissions.service';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { RolesController } from './controllers/roles.controller';
import { PermissionsController } from './controllers/permission.controller';

import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { ResourceAccessGuard } from './guards/resource-access.guard';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('config.jwt.accessSecret'),
        signOptions: {
          expiresIn: cfg.get<string>('config.jwt.accessExpiresIn'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    {
      provide: UserService,
      useClass: UserService,
      scope: Scope.REQUEST,
    },
    RolesService,
    PermissionsService,
    JwtStrategy,
    JwtAuthGuard,
    JwtRefreshStrategy,
    JwtRefreshGuard,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
  controllers: [
    AuthController,
    UserController,
    RolesController,
    PermissionsController,
  ],
  exports: [AuthService],
})
export class AuthModule {}
