import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('equipment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('equipment')
export class EquipmentController {
  constructor(private service: EquipmentService) {}

  @Get() @ApiOperation({ summary: 'List equipment' })
  @ApiQuery({ name: 'farmId', required: false, type: Number })
  findAll(@Query() q: PaginationDto, @Query('farmId') farmId?: number) { return this.service.findAll({ ...q, farmId }); }

  @Get(':id') @ApiOperation({ summary: 'Get equipment' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post() @ApiOperation({ summary: 'Create equipment' })
  create(@Body() dto: CreateEquipmentDto) { return this.service.create(dto); }

  @Put(':id') @ApiOperation({ summary: 'Update equipment' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEquipmentDto) { return this.service.update(id, dto); }

  @Delete(':id') @ApiOperation({ summary: 'Delete equipment' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
