import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Operation, OperationDocument } from './schemas/operation.schema';
import { EventsGateway } from '../events/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from 'src/notifications/types/notification.types';
import { OPERATION_MONITOR_CONSTANTS } from './constants/operation-monitor.constants';

@Injectable()
export class OperationsMonitorService {
  constructor(
    @InjectModel(Operation.name)
    private operationModel: Model<OperationDocument>,
    private eventsGateway: EventsGateway,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkOperations() {
    const now = new Date();
    const fifteenMinutesAgo = new Date(
      now.getTime() - OPERATION_MONITOR_CONSTANTS.CHECK_INTERVAL_MS,
    );

    const operations = await this.operationModel
      .find({
        status: 'active',
        start_time: { $lte: fifteenMinutesAgo },
      })
      .exec();

    for (const operation of operations) {
      const checkInRatio =
        operation.total_pax > 0
          ? (operation.checked_in_count || 0) / operation.total_pax
          : 0;

      if (
        checkInRatio < OPERATION_MONITOR_CONSTANTS.LOW_CHECKIN_RATE_THRESHOLD
      ) {
        const message = `Operation ${operation.code || operation.tour_name}: Low check-in rate (${(checkInRatio * 100).toFixed(0)}%)`;

        await this.notificationsService.create({
          message: message,
          type: NotificationType.WARNING,
          related_id: operation._id.toString(),
        });

        this.eventsGateway.emitAlert({
          type: 'low_checkin_rate',
          operationId: operation._id.toString(),
          operationCode: operation.code,
          tourName: operation.tour_name,
          checkedInCount: operation.checked_in_count,
          totalPax: operation.total_pax,
          checkInRatio: checkInRatio,
          message,
        });
      }
    }
  }
}
