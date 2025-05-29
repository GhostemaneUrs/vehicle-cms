import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectService } from '../../projects/services/project.service';
import { OrganizationalService } from '../../organizational/services/organizational.service';
import { JwtPayload } from '../dtos/auth.dto';

export interface ResourceAccessOptions {
  projectProp?: string;
  organizationalProp?: string;
}

@Injectable()
export class ResourceAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly projectService: ProjectService,
    private readonly ouService: OrganizationalService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    const user = req.user as JwtPayload;
    const meta =
      this.reflector.get<ResourceAccessOptions>(
        'resourceAccess',
        ctx.getHandler(),
      ) || {};

    if (!meta.projectProp && !meta.organizationalProp) {
      return true;
    }

    if (meta.projectProp) {
      const projectId =
        req.params?.[meta.projectProp] ??
        req.body?.[meta.projectProp] ??
        req.query?.[meta.projectProp];

      if (!projectId) {
        throw new NotFoundException(
          `Project identifier ("${meta.projectProp}") not provided`,
        );
      }

      const ok = await this.projectService.userHasAccess(user.sub, projectId);
      if (!ok) {
        throw new ForbiddenException('Access denied to project');
      }
    }

    if (meta.organizationalProp) {
      const organizationId =
        req.params?.[meta.organizationalProp] ??
        req.body?.[meta.organizationalProp] ??
        req.query?.[meta.organizationalProp];

      if (!organizationId) {
        throw new NotFoundException(
          `Organizational identifier ("${meta.organizationalProp}") not provided`,
        );
      }
      const ok = await this.ouService.userHasAccess(user.sub, organizationId);
      if (!ok) {
        throw new ForbiddenException('Access denied to organizational');
      }
    }

    return true;
  }
}
