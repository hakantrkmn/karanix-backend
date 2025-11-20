import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VehicleHistory,
  VehicleHistorySchema,
} from './schemas/vehicle-history.schema';
import {
  VehicleLastPing,
  VehicleLastPingSchema,
} from './schemas/vehicle-last-ping.schema';
import { EventsModule } from 'src/events/events.module';
import { OperationsModule } from 'src/operations/operations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleHistory.name, schema: VehicleHistorySchema },
      { name: VehicleLastPing.name, schema: VehicleLastPingSchema },
    ]),
    EventsModule,
    OperationsModule,
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
