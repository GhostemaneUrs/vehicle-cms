import { IsString, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transfer } from '../../transfers/entities/transfer.entity';
import { Exclude, Expose } from 'class-transformer';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle plate' })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({ description: 'Vehicle service' })
  @IsString()
  @IsNotEmpty()
  service: string;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiProperty({ description: 'Vehicle ID', format: 'uuid' })
  @IsUUID()
  id: string;
}

@Exclude()
export class ReadVehicleDto {
  @Expose()
  @ApiProperty({ description: 'Vehicle ID', format: 'uuid' })
  @IsUUID()
  id: string;

  @Expose()
  @ApiProperty({ description: 'Vehicle plate' })
  plate: string;

  @Expose()
  @ApiProperty({ description: 'Vehicle service' })
  service: string;

  @Expose()
  @ApiProperty({ description: 'Vehicle transfers' })
  @IsArray()
  transfers: Transfer[];
}
