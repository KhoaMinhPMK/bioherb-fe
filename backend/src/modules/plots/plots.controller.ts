import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PlotsService } from './plots.service';
import { CreatePlotDto } from './dto/create-plot.dto';
import { UpdatePlotDto } from './dto/update-plot.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('plots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plots')
export class PlotsController {
  constructor(private service: PlotsService) {}

  @Get()
  @ApiOperation({ summary: 'List plots' })
  @ApiQuery({ name: 'farmId', required: false, type: Number })
  findAll(@Query() query: PaginationDto, @Query('farmId') farmId?: number) {
    return this.service.findAll({ ...query, farmId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plot by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create plot' })
  create(@Body() dto: CreatePlotDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update plot' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlotDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete plot' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
