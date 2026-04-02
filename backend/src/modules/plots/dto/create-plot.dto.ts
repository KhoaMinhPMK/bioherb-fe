import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreatePlotDto {
  @ApiProperty()
  @IsInt()
  farmId: number;

  @ApiProperty({ example: 'PLOT001' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Lô 1 - Rau xanh' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  areaHa?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  defaultCropName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coordsText?: string;
}
