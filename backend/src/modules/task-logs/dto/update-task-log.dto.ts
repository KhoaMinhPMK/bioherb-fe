import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTaskLogDto } from './create-task-log.dto';

export class UpdateTaskLogDto extends PartialType(
  OmitType(CreateTaskLogDto, ['createdBy'] as const),
) {}
