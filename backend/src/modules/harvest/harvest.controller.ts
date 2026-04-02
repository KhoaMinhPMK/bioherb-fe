import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HarvestService } from './harvest.service';
import { CreateHarvestBatchDto } from './dto/create-harvest-batch.dto';
import { UpdateHarvestBatchDto } from './dto/update-harvest-batch.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('harvest')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('harvest-batches')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Get()
  @ApiOperation({ summary: 'List harvest batches' })
  findAll(@Query() query: PaginationDto & { cropCycleId?: number }) {
    return this.harvestService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get harvest batch by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.harvestService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create harvest batch' })
  create(@Body() dto: CreateHarvestBatchDto) {
    return this.harvestService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update harvest batch' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHarvestBatchDto) {
    return this.harvestService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete harvest batch' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.harvestService.remove(id);
  }
}
