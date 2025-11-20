import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(notification: CreateNotificationDto) {
    const newNotification = new this.notificationModel(notification);
    return newNotification.save();
  }

  async findAll() {
    return this.notificationModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }
  async markAsRead(id: MarkAsReadDto) {
    return this.notificationModel.findByIdAndUpdate(
      id,
      { read: true },
      { new: true },
    );
  }
}
