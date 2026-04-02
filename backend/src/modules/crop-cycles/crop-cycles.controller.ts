import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CropCyclesService } from './crop-cycles.service';
import { CreateCropCycleDto } from './dto/create-crop-cycle.dto';
import { UpdateCropCycleDto } from './dto/update-crop-cycle.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('crop-cycles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crop-cycles')
export class CropCyclesController {
  constructor(private service: CropCyclesService) {}

  @Get()
  @ApiOperation({ summary: 'List crop cycles' })
  @ApiQuery({ name: 'plotId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  findAll(
    @Query() query: PaginationDto,
    @Query('plotId') plotId?: number,
    @Query('status') status?: string,
  ) {
    return this.service.findAll({ ...query, plotId, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get crop cycle detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create crop cycle' })
  create(@Body() dto: CreateCropCycleDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update crop cycle' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCropCycleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete crop cycle' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
