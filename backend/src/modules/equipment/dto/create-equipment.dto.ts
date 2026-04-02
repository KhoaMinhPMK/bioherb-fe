import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty() @IsInt() farmId: number;
  @ApiProperty({ example: 'TB001' }) @IsString() code: string;
  @ApiProperty({ example: 'Máy cày mini' }) @IsString() name: string;
  @ApiProperty({ example: 'machine' }) @IsString() type: string;
  @ApiPropertyOptional({ default: 0 }) @IsOptional() @IsNumber() hourlyCost?: number;
  @ApiPropertyOptional({ default: 0 }) @IsOptional() @IsNumber() fuelCost?: number;
}
