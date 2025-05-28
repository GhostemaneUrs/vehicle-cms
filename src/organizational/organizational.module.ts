import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizational } from './entities/organizational.entity';
import { OrganizationalService } from './services/organizational.service';
import { OrganizationalController } from './controller/organizational.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organizational])],
  controllers: [OrganizationalController],
  providers: [OrganizationalService],
  exports: [OrganizationalService],
})
export class OrganizationalModule {}
