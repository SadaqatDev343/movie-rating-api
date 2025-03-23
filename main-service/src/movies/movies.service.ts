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

    // Check if user has already rated this movie
    const existingRatingIndex = movie.ratings.findIndex(
      (r) => r.userId === dto.userId
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      movie.ratings[existingRatingIndex].rating = dto.rating;
    } else {
      // Add new rating
      movie.ratings.push({ userId: dto.userId, rating: dto.rating });
    }

    // Recalculate average rating properly
    if (movie.ratings.length > 0) {
      // Calculate sum of all ratings
      const sumRatings = movie.ratings.reduce((sum, r) => sum + r.rating, 0);
      // Calculate average with proper precision
      movie.averageRating = Number(
        (sumRatings / movie.ratings.length).toFixed(1)
      );
    } else {
      // Default value if no ratings
      movie.averageRating = 0;
    }

    // Save the updated movie
    await movie.save();

    return {
      title: movie.title,
      averageRating: movie.averageRating,
    };
  }
}
