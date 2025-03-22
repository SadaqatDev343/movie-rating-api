import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    return this.categoryModel.create(dto);
  }

  async getAllCategories() {
    return this.categoryModel.find();
  }

  async getCategoryById(id: string) {
    return this.categoryModel.findById(id);
  }

  async seedCategories() {
    const categories = [
      'Action',
      'Horror',
      'Comedy',
      'Animated',
      'Drama',
      'Sci-Fi',
      'Thriller',
      'Romance',
      'Mystery',
      'Fantasy',
      'Adventure',
      'Documentary',
    ];
    for (const name of categories) {
      await this.categoryModel.updateOne({ name }, { name }, { upsert: true });
    }
  }
}
