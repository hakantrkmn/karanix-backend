import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleHistoryDocument = VehicleHistory & Document;

@Schema({ timestamps: true })
export class VehicleHistory {
  @Prop({ required: true })
  vehicle_id: string;

  @Prop({
    type: { lat: Number, lng: Number },
    required: true,
    _id: false,
  })
  location: { lat: number; lng: number };

  @Prop()
  heading: number;

  @Prop()
  speed: number;

  @Prop()
  timestamp: Date;
}

export const VehicleHistorySchema =
  SchemaFactory.createForClass(VehicleHistory);
