import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  message: string;

  @Prop({
    required: true,
    enum: ['info', 'warning', 'critical'],
    default: 'info',
  })
  type: string;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  related_id: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
