import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectService } from './services/project.service';
import { ProjectsController } from './controller/project.controller';
import { OrganizationalModule } from '../organizational/organizational.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => OrganizationalModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
