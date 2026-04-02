import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTaskPlanDto } from './dto/create-task-plan.dto';
import { UpdateTaskPlanDto } from './dto/update-task-plan.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class TaskPlansService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { cropCycleId?: number }) {
    const { page = 1, limit = 20, search, cropCycleId } = query;
    const where: any = {};
    if (cropCycleId) where.cropCycleId = cropCycleId;
    if (search) where.title = { contains: search };

    const [data, total] = await Promise.all([
      this.prisma.taskPlan.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { planDate: 'desc' },
        include: {
          cropCycle: { select: { id: true, code: true } },
          taskType: true,
          _count: { select: { taskLogs: true } },
        },
      }),
      this.prisma.taskPlan.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.taskPlan.findUnique({
      where: { id },
      include: { cropCycle: true, taskType: true, taskLogs: true },
    });
    if (!item) throw new NotFoundException('TaskPlan not found');
    return item;
  }

  async create(dto: CreateTaskPlanDto) {
    return this.prisma.taskPlan.create({
      data: {
        ...dto,
        planDate: new Date(dto.planDate),
      },
    });
  }

  async update(id: number, dto: UpdateTaskPlanDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.planDate) data.planDate = new Date(dto.planDate);
    return this.prisma.taskPlan.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.taskPlan.delete({ where: { id } });
  }
}
