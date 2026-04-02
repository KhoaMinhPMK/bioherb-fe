import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('farms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('farms')
export class FarmsController {
  constructor(private service: FarmsService) {}

  @Get()
  @ApiOperation({ summary: 'List farms' })
  @ApiQuery({ name: 'cooperativeId', required: false, type: Number })
  findAll(
    @Query() query: PaginationDto,
    @Query('cooperativeId') cooperativeId?: number,
  ) {
    return this.service.findAll({ ...query, cooperativeId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get farm by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create farm' })
  create(@Body() dto: CreateFarmDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update farm' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFarmDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete farm' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
