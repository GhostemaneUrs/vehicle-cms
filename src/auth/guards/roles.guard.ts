import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/roles.decorator';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!requiredRoles.length) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as unknown as User;

    if (!user?.roles) throw new ForbiddenException('No roles found');
    const has = user.roles.some((r) => requiredRoles.includes(r.name));
    if (!has) throw new ForbiddenException('Insufficient role');
    return true;
  }
}
