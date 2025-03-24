import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './category.dto';
import { Public } from 'src/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid category data.',
  })
  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Public() // Make this route public
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched all categories.',
    type: [CreateCategoryDto],
  })
  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched category by ID.',
    type: CreateCategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the category to be fetched.',
    type: String,
  })
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }
}
