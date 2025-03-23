import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from '../category/category.schema';
import { Types } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  releaseYear: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], required: true })
  categories: Types.ObjectId[];

  @Prop({ default: 5 })
  averageRating: number;
  @Prop({ default: [] })
  ratings: { userId: string; rating: number }[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
