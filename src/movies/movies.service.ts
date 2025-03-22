import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './movies.schema';
import { CreateMovieDto, RateMovieDto } from './movies.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async createMovie(dto: CreateMovieDto) {
    return this.movieModel.create(dto);
  }

  async getAllMovies(search?: string, page: number = 1, limit: number = 10) {
    const filter = search ? { title: new RegExp(search, 'i') } : {};

    const skip = (page - 1) * limit;

    const movies = await this.movieModel
      .find(filter)
      .populate('categories')
      .skip(skip)
      .limit(limit);
    console.log(movies);
    const totalMovies = await this.movieModel.countDocuments(filter);

    return {
      movies,
      totalMovies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit),
    };
  }

  async getMovieById(id: string) {
    const movie = await this.movieModel.findById(id).populate('category');
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async rateMovie(movieId: string, dto: RateMovieDto) {
    const movie = await this.movieModel.findById(movieId);
    if (!movie) throw new NotFoundException('Movie not found');

    const existingRating = movie.ratings.find((r) => r.userId === dto.userId);
    if (existingRating) {
      existingRating.rating = dto.rating;
    } else {
      movie.ratings.push({ userId: dto.userId, rating: dto.rating });
    }

    const totalRatings = movie.ratings.length;
    const sumRatings = movie.ratings.reduce((sum, r) => sum + r.rating, 0);
    movie.averageRating = sumRatings / totalRatings;

    await movie.save();
    return movie;
  }
}
