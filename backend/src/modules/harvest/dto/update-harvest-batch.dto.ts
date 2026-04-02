import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateHarvestBatchDto } from './create-harvest-batch.dto';
export class UpdateHarvestBatchDto extends PartialType(OmitType(CreateHarvestBatchDto, ['createdBy'] as const)) {}
