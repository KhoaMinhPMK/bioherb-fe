import { Module } from '@nestjs/common';
import { TaskPlansService } from './task-plans.service';
import { TaskPlansController } from './task-plans.controller';

@Module({
  controllers: [TaskPlansController],
  providers: [TaskPlansService],
  exports: [TaskPlansService],
})
export class TaskPlansModule {}
