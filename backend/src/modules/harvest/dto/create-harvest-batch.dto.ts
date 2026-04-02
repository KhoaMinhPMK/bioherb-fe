import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber, IsDateString } from 'class-validator';

export class CreateHarvestBatchDto {
  @ApiProperty() @IsInt() cropCycleId: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() plotId?: number;
  @ApiProperty({ example: 'HB2025-001' }) @IsString() code: string;
  @ApiProperty() @IsDateString() harvestDate: string;
  @ApiProperty() @IsNumber() quantityKg: number;
  @ApiPropertyOptional() @IsOptional() @IsString() quality?: string;
  @ApiProperty() @IsInt() createdBy: number;
}
