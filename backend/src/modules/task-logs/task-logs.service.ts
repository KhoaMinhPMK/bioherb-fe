import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { UpdateTaskLogDto } from './dto/update-task-log.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class TaskLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { cropCycleId?: number; status?: string }) {
    const { page = 1, limit = 20, search, cropCycleId, status } = query;
    const where: any = {};
    if (cropCycleId) where.cropCycleId = cropCycleId;
    if (status) where.status = status;
    if (search) where.taskName = { contains: search };

    const [data, total] = await Promise.all([
      this.prisma.taskLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { workDate: 'desc' },
        include: {
          cropCycle: { select: { id: true, code: true } },
          taskType: true,
          workers: { include: { worker: { select: { id: true, name: true, code: true } } } },
          inputs: { include: { inputItem: { select: { id: true, name: true, code: true } } } },
          equipment: { include: { equipment: { select: { id: true, name: true, code: true } } } },
        },
      }),
      this.prisma.taskLog.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.taskLog.findUnique({
      where: { id },
      include: {
        cropCycle: { include: { plot: { include: { farm: true } } } },
        taskPlan: true,
        taskType: true,
        workers: { include: { worker: true } },
        inputs: { include: { inputItem: true } },
        equipment: { include: { equipment: true } },
      },
    });
    if (!item) throw new NotFoundException('TaskLog not found');
    return item;
  }

  async create(dto: CreateTaskLogDto) {
    const { workers, inputs, equipment, ...logData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const taskLog = await tx.taskLog.create({
        data: {
          ...logData,
          workDate: new Date(logData.workDate),
        },
      });

      if (workers?.length) {
        await tx.taskLogWorker.createMany({
          data: workers.map((w) => ({ ...w, taskLogId: taskLog.id })),
        });
      }

      if (inputs?.length) {
        await tx.taskLogInput.createMany({
          data: inputs.map((i) => ({ ...i, taskLogId: taskLog.id })),
        });
      }

      if (equipment?.length) {
        await tx.taskLogEquipment.createMany({
          data: equipment.map((e) => ({ ...e, taskLogId: taskLog.id })),
        });
      }

      return this.findOne(taskLog.id);
    });
  }

  async update(id: number, dto: UpdateTaskLogDto) {
    const existing = await this.findOne(id);
    if (existing.status === 'approved') {
      throw new BadRequestException('Cannot edit an approved task log');
    }

    const { workers, inputs, equipment, ...logData } = dto;
    const data: any = { ...logData };
    if (logData.workDate) data.workDate = new Date(logData.workDate);

    return this.prisma.$transaction(async (tx) => {
      await tx.taskLog.update({ where: { id }, data });

      if (workers !== undefined) {
        await tx.taskLogWorker.deleteMany({ where: { taskLogId: id } });
        if (workers?.length) {
          await tx.taskLogWorker.createMany({
            data: workers.map((w) => ({ ...w, taskLogId: id })),
          });
        }
      }

      if (inputs !== undefined) {
        await tx.taskLogInput.deleteMany({ where: { taskLogId: id } });
        if (inputs?.length) {
          await tx.taskLogInput.createMany({
            data: inputs.map((i) => ({ ...i, taskLogId: id })),
          });
        }
      }

      if (equipment !== undefined) {
        await tx.taskLogEquipment.deleteMany({ where: { taskLogId: id } });
        if (equipment?.length) {
          await tx.taskLogEquipment.createMany({
            data: equipment.map((e) => ({ ...e, taskLogId: id })),
          });
        }
      }

      return this.findOne(id);
    });
  }

  async approve(id: number, userId: number) {
    const log = await this.findOne(id);
    if (log.status !== 'submitted') {
      throw new BadRequestException('Only submitted logs can be approved');
    }
    return this.prisma.taskLog.update({
      where: { id },
      data: { status: 'approved', approvedBy: userId, approvedAt: new Date() },
    });
  }

  async reject(id: number, userId: number, reason: string) {
    const log = await this.findOne(id);
    if (log.status !== 'submitted') {
      throw new BadRequestException('Only submitted logs can be rejected');
    }
    return this.prisma.taskLog.update({
      where: { id },
      data: { status: 'rejected', approvedBy: userId, approvedAt: new Date(), rejectedReason: reason },
    });
  }

  async submit(id: number) {
    const log = await this.findOne(id);
    if (log.status !== 'draft') {
      throw new BadRequestException('Only draft logs can be submitted');
    }
    return this.prisma.taskLog.update({
      where: { id },
      data: { status: 'submitted', submittedAt: new Date() },
    });
  }

  async remove(id: number) {
    const log = await this.findOne(id);
    if (log.status === 'approved') {
      throw new BadRequestException('Cannot delete an approved task log');
    }
    return this.prisma.$transaction(async (tx) => {
      await tx.taskLogWorker.deleteMany({ where: { taskLogId: id } });
      await tx.taskLogInput.deleteMany({ where: { taskLogId: id } });
      await tx.taskLogEquipment.deleteMany({ where: { taskLogId: id } });
      return tx.taskLog.delete({ where: { id } });
    });
  }
}
