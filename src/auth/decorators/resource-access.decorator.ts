import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ResourceAccessGuard } from '../guards/resource-access.guard';

export interface ResourceAccessOptions {
  projectProp?: string;
  organizationalProp?: string;
}

export function ResourceAccess(opts: ResourceAccessOptions) {
  return applyDecorators(
    SetMetadata('resourceAccess', opts),
    UseGuards(ResourceAccessGuard),
  );
}
