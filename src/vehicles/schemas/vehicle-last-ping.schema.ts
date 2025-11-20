import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleLastPingDocument = VehicleLastPing & Document;

@Schema({ timestamps: true })
export class VehicleLastPing {
  @Prop({ required: true, unique: true })
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
  last_ping: Date;
}

export const VehicleLastPingSchema =
  SchemaFactory.createForClass(VehicleLastPing);
