import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CooperativesModule } from './modules/cooperatives/cooperatives.module';
import { FarmsModule } from './modules/farms/farms.module';
import { PlotsModule } from './modules/plots/plots.module';
import { CropCyclesModule } from './modules/crop-cycles/crop-cycles.module';
import { TaskPlansModule } from './modules/task-plans/task-plans.module';
import { TaskLogsModule } from './modules/task-logs/task-logs.module';
import { WorkersModule } from './modules/workers/workers.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { InputItemsModule } from './modules/input-items/input-items.module';
import { HarvestModule } from './modules/harvest/harvest.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CooperativesModule,
    FarmsModule,
    PlotsModule,
    CropCyclesModule,
    TaskPlansModule,
    TaskLogsModule,
    WorkersModule,
    EquipmentModule,
    InputItemsModule,
    HarvestModule,
  ],
})
export class AppModule {}
