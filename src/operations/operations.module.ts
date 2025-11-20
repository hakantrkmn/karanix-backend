import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Operation, OperationSchema } from './schemas/operation.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Operation.name, schema: OperationSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [OperationsController],
  providers: [OperationsService],
  exports: [OperationsService],
})
export class OperationsModule {}
