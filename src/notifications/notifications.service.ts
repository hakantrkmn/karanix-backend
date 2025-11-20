import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { EventsGateway } from '../events/events.gateway';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel({
      message: createNotificationDto.message,
      type: createNotificationDto.type,
      related_id: createNotificationDto.related_id,
    });
    await notification.save();
    this.eventsGateway.emitAlert(notification);
    return notification;
  }

  async findAll() {
    return this.notificationModel
      .find()
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async markAsRead(markAsReadDto: MarkAsReadDto) {
    return this.notificationModel.findByIdAndUpdate(
      markAsReadDto.id,
      { read: true },
      { new: true },
    );
  }
}
