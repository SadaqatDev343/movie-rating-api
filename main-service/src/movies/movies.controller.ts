import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, RateMovieDto } from './movies.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Get Movie By ID
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the movie to retrieve',
    type: String,
  })
  @ApiOperation({ summary: 'Get a movie by its ID' })
  @ApiResponse({ status: 200, description: 'Movie retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }

  // Create Movie
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiBody({
    description: 'Create a new movie',
    type: CreateMovieDto,
  })
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data.' })
  async createMovie(@Body() dto: CreateMovieDto) {
    console.log('Create Movie DTO: ', dto);
    return this.moviesService.createMovie(dto);
  }
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getAllMovies(
    @Query('q') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.moviesService.getAllMovies(search, Number(page), Number(limit));
  }

  @ApiBearerAuth('JWT-auth')
  @Post(':movieId/rate')
  @ApiParam({
    name: 'movieId',
    required: true,
    description: 'ID of the movie to rate',
    type: String,
  })
  @ApiOperation({ summary: 'Rate a movie by movie ID' })
  @ApiResponse({ status: 200, description: 'Movie successfully rated' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data.' })
  async rateMovie(
    @Param('movieId') movieId: string,
    @Body() dto: RateMovieDto
  ) {
    return this.moviesService.rateMovie(movieId, dto);
  }
}
