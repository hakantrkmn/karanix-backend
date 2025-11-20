import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PaxDocument = Pax & Document;

@Schema({ timestamps: true })
export class Pax {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop({
    type: {
      lat: Number,
      lng: Number,
      address: String,
    },
    _id: false,
  })
  pickup_point: { lat: number; lng: number; address: string };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Operation' })
  operation_id: string;

  @Prop({
    required: true,
    enum: ['waiting', 'checked_in', 'no_show'],
    default: 'waiting',
  })
  status: string;

  @Prop()
  seat_no: string;

  @Prop()
  reservation_id: string;

  @Prop()
  notes: string;

  // For Idempotency
  @Prop()
  checkin_event_id: string;
}

export const PaxSchema = SchemaFactory.createForClass(Pax);
