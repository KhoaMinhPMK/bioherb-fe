import { Module } from '@nestjs/common';
import { InputItemsService } from './input-items.service';
import { InputItemsController } from './input-items.controller';

@Module({ controllers: [InputItemsController], providers: [InputItemsService], exports: [InputItemsService] })
export class InputItemsModule {}
