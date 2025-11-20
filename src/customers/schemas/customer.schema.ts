import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Location' }] })
  locations: string[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
