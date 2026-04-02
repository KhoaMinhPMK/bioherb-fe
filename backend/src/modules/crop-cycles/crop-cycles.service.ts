import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCropCycleDto } from './dto/create-crop-cycle.dto';
import { UpdateCropCycleDto } from './dto/update-crop-cycle.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CropCyclesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { plotId?: number; status?: string }) {
    const { page = 1, limit = 20, search, plotId, status } = query;
    const where: any = {};
    if (plotId) where.plotId = plotId;
    if (status) where.status = status;
    if (search) where.OR = [{ code: { contains: search } }, { notes: { contains: search } }];

    const [data, total] = await Promise.all([
      this.prisma.cropCycle.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          plot: { select: { id: true, name: true, code: true, farm: { select: { id: true, name: true } } } },
          crop: true,
          _count: { select: { taskLogs: true, harvestBatches: true } },
        },
      }),
      this.prisma.cropCycle.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.cropCycle.findUnique({
      where: { id },
      include: {
        plot: { include: { farm: true } },
        crop: true,
        taskPlans: { orderBy: { planDate: 'desc' } },
        taskLogs: { orderBy: { workDate: 'desc' }, take: 10 },
        harvestBatches: true,
        _count: { select: { taskLogs: true, harvestBatches: true, pestIncidents: true } },
      },
    });
    if (!item) throw new NotFoundException('CropCycle not found');
    return item;
  }

  async create(dto: CreateCropCycleDto) {
    // BR-01: One active cycle per plot
    const activeCycle = await this.prisma.cropCycle.findFirst({
      where: {
        plotId: dto.plotId,
        status: { in: ['active', 'in_progress'] },
      },
    });
    if (activeCycle) {
      throw new BadRequestException(
        `Plot already has an active crop cycle: ${activeCycle.code}`,
      );
    }

    return this.prisma.cropCycle.create({
      data: {
        plotId: dto.plotId,
        cropId: dto.cropId,
        code: dto.code,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        expectedHarvestDate: dto.expectedHarvestDate
          ? new Date(dto.expectedHarvestDate)
          : undefined,
        status: dto.status || 'draft',
        notes: dto.notes,
      },
      include: { plot: true, crop: true },
    });
  }

  async update(id: number, dto: UpdateCropCycleDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    if (dto.expectedHarvestDate) data.expectedHarvestDate = new Date(dto.expectedHarvestDate);
    return this.prisma.cropCycle.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cropCycle.delete({ where: { id } });
  }
}
