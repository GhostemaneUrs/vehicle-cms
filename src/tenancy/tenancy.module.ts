import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenancy } from './entities/tenancy.entity';
import { TenancyService } from './services/tenancy.service';
import { TenancyController } from './controllers/tenancy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tenancy])],
  providers: [TenancyService],
  controllers: [TenancyController],
  exports: [TenancyService],
})
export class TenancyModule {}
