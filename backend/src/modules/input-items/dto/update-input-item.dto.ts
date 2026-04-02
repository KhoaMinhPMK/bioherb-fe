import { PartialType } from '@nestjs/swagger';
import { CreateInputItemDto } from './create-input-item.dto';
export class UpdateInputItemDto extends PartialType(CreateInputItemDto) {}
