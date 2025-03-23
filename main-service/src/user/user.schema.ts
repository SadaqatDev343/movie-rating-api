import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  address?: string;

  @Prop()
  image?: string;

  @Prop()
  dob?: Date;

  @Prop({ type: [String], default: [] })
  categories?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
