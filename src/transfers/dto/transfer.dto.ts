import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty({ description: 'Type of transfer' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Vehicle ID', format: 'uuid' })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ description: 'Client ID', format: 'uuid' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ description: 'Transmitter ID', format: 'uuid' })
  @IsUUID()
  transmitterId: string;

  @ApiProperty({ description: 'Project ID', format: 'uuid' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ description: 'Organizational ID', format: 'uuid' })
  @IsUUID()
  organizationalId: string;
}

export class UpdateTransferDto extends PartialType(CreateTransferDto) {
  @ApiProperty({ description: 'Transfer ID', format: 'uuid' })
  @IsUUID()
  id: string;
}

export class ReadTransferDto {
  @ApiProperty({ description: 'UUID de la transferencia', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Tipo de la transferencia' })
  type: string;

  @ApiProperty({ description: 'UUID del vehículo asociado', format: 'uuid' })
  vehicleId: string;

  @ApiProperty({ description: 'UUID del cliente', format: 'uuid' })
  clientId: string;

  @ApiProperty({ description: 'UUID del transmisor', format: 'uuid' })
  transmitterId: string;

  @ApiProperty({ description: 'UUID del proyecto', format: 'uuid' })
  projectId: string;

  @ApiProperty({
    description: 'UUID de la unidad organizativa',
    format: 'uuid',
  })
  organizational: string;
}
