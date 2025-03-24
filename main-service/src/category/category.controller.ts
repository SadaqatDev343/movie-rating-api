import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './category.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }
  @Public()
  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Post('seed')
  async seedCategories() {
    return this.categoryService.seedCategories();
  }
}
