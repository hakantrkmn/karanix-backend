import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { OperationsMonitorService } from './operations-monitor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Operation, OperationSchema } from './schemas/operation.schema';
import { Pax, PaxSchema } from '../pax/schemas/pax.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Operation.name, schema: OperationSchema },
      { name: Pax.name, schema: PaxSchema },
    ]),
    NotificationsModule,
    EventsModule,
  ],
  controllers: [OperationsController],
  providers: [OperationsService, OperationsMonitorService],
  exports: [OperationsService],
})
export class OperationsModule {}
