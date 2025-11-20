import { Module } from '@nestjs/common';
import { PaxService } from './pax.service';
import { PaxController } from './pax.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pax, PaxSchema } from './schemas/pax.schema';
import {
  Operation,
  OperationSchema,
} from '../operations/schemas/operation.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pax.name, schema: PaxSchema },
      { name: Operation.name, schema: OperationSchema },
    ]),
    NotificationsModule,
    EventsModule,
  ],
  controllers: [PaxController],
  providers: [PaxService],
  exports: [PaxService],
})
export class PaxModule {}
