import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateHarvestBatchDto } from './dto/create-harvest-batch.dto';
import { UpdateHarvestBatchDto } from './dto/update-harvest-batch.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class HarvestService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { cropCycleId?: number }) {
    const { page = 1, limit = 20, search, cropCycleId } = query;
    const where: any = {};
    if (cropCycleId) where.cropCycleId = cropCycleId;
    if (search) where.code = { contains: search };

    const [data, total] = await Promise.all([
      this.prisma.harvestBatch.findMany({
        where, skip: (page - 1) * limit, take: limit, orderBy: { harvestDate: 'desc' },
        include: {
          cropCycle: { select: { id: true, code: true, plot: { select: { id: true, name: true } } } },
          _count: { select: { productLots: true } },
        },
      }),
      this.prisma.harvestBatch.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.harvestBatch.findUnique({
      where: { id },
      include: { cropCycle: { include: { plot: { include: { farm: true } } } }, productLots: true },
    });
    if (!item) throw new NotFoundException('HarvestBatch not found');
    return item;
  }

  async create(dto: CreateHarvestBatchDto) {
    // BR-05: harvest only for open cycles
    const cycle = await this.prisma.cropCycle.findUnique({ where: { id: dto.cropCycleId } });
    if (!cycle || !['active', 'in_progress'].includes(cycle.status)) {
      throw new BadRequestException('Can only harvest from an active crop cycle');
    }
    return this.prisma.harvestBatch.create({
      data: { ...dto, harvestDate: new Date(dto.harvestDate) },
      include: { cropCycle: true },
    });
  }

  async update(id: number, dto: UpdateHarvestBatchDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.harvestDate) data.harvestDate = new Date(dto.harvestDate);
    return this.prisma.harvestBatch.update({ where: { id }, data });
  }

  async remove(id: number) { await this.findOne(id); return this.prisma.harvestBatch.delete({ where: { id } }); }
}
