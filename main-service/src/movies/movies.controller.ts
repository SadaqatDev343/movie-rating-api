import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, RateMovieDto } from './movies.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async createMovie(@Body() dto: CreateMovieDto) {
    console.log('Create Movie DTO: ', dto);

    return this.moviesService.createMovie(dto);
  }
  @Post('seed')
  async seedMovies() {
    return this.moviesService.seedMovies();
  }

  @Get()
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

  @Get(':id')
  async getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }

  @Post(':id/rate')
  async rateMovie(@Param('id') id: string, @Body() dto: RateMovieDto) {
    return this.moviesService.rateMovie(id, dto);
  }
}
