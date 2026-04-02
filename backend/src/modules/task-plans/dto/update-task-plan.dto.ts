import { PartialType } from '@nestjs/swagger';
import { CreateTaskPlanDto } from './create-task-plan.dto';

export class UpdateTaskPlanDto extends PartialType(CreateTaskPlanDto) {}
