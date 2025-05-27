import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Scope } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../../database/common/database.tokens';
import { Vehicle } from '../entities/vehicle.entity';
import {
  CreateVehicleDto,
  ReadVehicleDto,
  UpdateVehicleDto,
} from '../dto/vehicle.dto';
import { plainToClass } from 'class-transformer';

@Injectable({ scope: Scope.REQUEST })
export class VehicleService {
  private readonly vehicleRepository: Repository<Vehicle>;

  constructor(
    @Inject(TENANT_CONNECTION)
    private readonly dataSource: DataSource,
  ) {
    this.vehicleRepository = this.dataSource.getRepository(Vehicle);
  }

  async findAll(): Promise<ReadVehicleDto[]> {
    const vehicles = await this.vehicleRepository.find();

    return vehicles.map((vehicle) => plainToClass(ReadVehicleDto, vehicle));
  }

  async findOne(id: string): Promise<ReadVehicleDto> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    return plainToClass(ReadVehicleDto, vehicle);
  }

  async create(data: CreateVehicleDto): Promise<ReadVehicleDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const vehicle = await queryRunner.manager.findOne(Vehicle, {
        where: {
          plate: data.plate,
        },
      });

      if (vehicle) throw new BadRequestException('Vehicle already exists');

      const newVehicle = new Vehicle();
      newVehicle.plate = data.plate;
      newVehicle.service = data.service;

      const saved = await queryRunner.manager.save(Vehicle, newVehicle);

      await queryRunner.commitTransaction();
      return plainToClass(ReadVehicleDto, saved);
    } catch (error) {
      console.log('🚀 ~ VehicleService ~ create ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error creating vehicle');
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, data: UpdateVehicleDto): Promise<ReadVehicleDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await queryRunner.manager.findOne(Vehicle, {
        where: { id },
      });

      if (!existing) throw new NotFoundException('Vehicle not found');

      existing.plate = data.plate;
      existing.service = data.service;

      const saved = await queryRunner.manager.save(Vehicle, existing);

      await queryRunner.commitTransaction();
      return plainToClass(ReadVehicleDto, saved);
    } catch (error) {
      console.log('🚀 ~ VehicleService ~ update ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error updating vehicle');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const existing = await this.vehicleRepository.findOne({ where: { id } });

    if (!existing) throw new NotFoundException('Vehicle not found');

    await this.vehicleRepository.remove(existing);

    return { message: 'Vehicle deleted successfully' };
  }
}
