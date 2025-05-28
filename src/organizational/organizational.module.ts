import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizational } from './entities/organizational.entity';
import { OrganizationalService } from './services/organizational.service';
import { OrganizationalController } from './controller/organizational.controller';
import { ProjectModule } from '../projects/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organizational]),
    forwardRef(() => ProjectModule),
  ],
  controllers: [OrganizationalController],
  providers: [OrganizationalService],
  exports: [OrganizationalService],
})
export class OrganizationalModule {}
