import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@sankit.vn' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  roleId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  cooperativeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  farmId?: number;
}
