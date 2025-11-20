import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  role: 'admin' | 'guide' | 'driver';
}

export const UserSchema = SchemaFactory.createForClass(User);
