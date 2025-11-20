import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OperationDocument = Operation & Document;

@Schema({ timestamps: true })
export class Operation {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  tour_name: string;

  @Prop({
    required: true,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned',
  })
  status: string;

  @Prop()
  date: Date;

  @Prop()
  vehicle_id: string;

  @Prop()
  driver_id: string;

  @Prop()
  guide_id: string;

  @Prop()
  start_time: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Pax' }] })
  pax: string[];

  @Prop({ default: 0 })
  checked_in_count: number;

  @Prop({ default: 0 })
  total_pax: number;

  @Prop({
    type: [{ lat: Number, lng: Number }],
    default: [],
    _id: false,
  })
  route: { lat: number; lng: number }[];
}

export const OperationSchema = SchemaFactory.createForClass(Operation);
