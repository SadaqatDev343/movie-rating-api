import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../category/category.schema';
import { User } from '../user/user.schema';

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

  @Prop({ default: 0 }) // Set default average rating to 0
  averageRating: number;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: false },
      },
    ],
    default: [],
  })
  ratings: { user: Types.ObjectId; rating: number }[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
