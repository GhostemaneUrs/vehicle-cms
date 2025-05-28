import { Module, Global } from '@nestjs/common';
import { ResourceAccessGuard } from './guards/resource-access.guard';
import { ProjectModule } from '../projects/project.module';
import { OrganizationalModule } from '../organizational/organizational.module';

@Global()
@Module({
  imports: [ProjectModule, OrganizationalModule],
  providers: [ResourceAccessGuard],
  exports: [ResourceAccessGuard],
})
export class SharedAuthModule {}
