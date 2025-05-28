import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { Request } from 'express';
import { JwtPayload } from '../../@types/express';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      ctx.getHandler(),
    );

    if (!required || required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as JwtPayload;

    if (!user || !user.permissions) {
      throw new ForbiddenException('User has no permissions array');
    }

    const permissions = required.every((p) => user.permissions.includes(p));

    if (!permissions) {
      throw new ForbiddenException(
        `Missing permissions: ${required
          .filter((p) => !user.permissions.includes(p))
          .join(', ')}`,
      );
    }

    return true;
  }
}
