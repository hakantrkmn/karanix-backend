import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema()
export class Location {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({
    type: { lat: Number, lng: Number },
    required: true,
    _id: false,
  })
  coordinates: { lat: number; lng: number };
}

export const LocationSchema = SchemaFactory.createForClass(Location);
