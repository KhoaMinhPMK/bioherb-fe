import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateInputItemDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() farmId?: number;
  @ApiProperty({ example: 'VT001' }) @IsString() code: string;
  @ApiProperty({ example: 'Phân NPK 16-16-8' }) @IsString() name: string;
  @ApiProperty({ example: 'fertilizer' }) @IsString() type: string;
  @ApiProperty({ example: 'kg' }) @IsString() unit: string;
  @ApiPropertyOptional() @IsOptional() @IsString() supplier?: string;
  @ApiPropertyOptional({ default: 0 }) @IsOptional() @IsNumber() unitPrice?: number;
  @ApiPropertyOptional({ default: 0 }) @IsOptional() @IsNumber() stockQty?: number;
  @ApiPropertyOptional({ default: 10 }) @IsOptional() @IsNumber() minStock?: number;
}
