import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie } from './movies.schema';
import { CreateMovieDto, RateMovieDto } from './movies.dto';
import { log } from 'node:console';

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
    console.log('movieId', movieId, 'movieId', dto.userId);

    // Clean movieId and userId (ensure it's a valid ObjectId)
    const cleanMovieId = movieId.replace(/[^\da-fA-F]/g, ''); // Remove non-hex characters
    const cleanUserId = dto.userId.replace(/[^\da-fA-F]/g, ''); // Remove non-hex characters

    // Check if movieId and userId are valid ObjectIds
    if (!Types.ObjectId.isValid(cleanMovieId)) {
      throw new BadRequestException('Invalid movie ID format');
    }
    if (!Types.ObjectId.isValid(cleanUserId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    // Convert to ObjectId
    const movieObjectId = new Types.ObjectId(cleanMovieId);
    const userObjectId = new Types.ObjectId(cleanUserId);

    // Ensure the movie exists in the database
    const movie = await this.movieModel.findById(movieObjectId);
    if (!movie) throw new NotFoundException('Movie not found');

    // Check if the user has already rated the movie
    const existingRatingIndex = movie.ratings.findIndex(
      (r) => r.user.toString() === userObjectId.toString()
    );

    if (existingRatingIndex !== -1) {
      // If the user already rated, update the rating
      movie.ratings[existingRatingIndex].rating = dto.rating;
    } else {
      // If the user hasn't rated, add a new rating
      movie.ratings.push({
        user: userObjectId,
        rating: dto.rating,
      });
    }

    // Recalculate the average rating
    const totalRatings = movie.ratings.length;
    const sumRatings = movie.ratings.reduce((sum, r) => sum + r.rating, 0);
    movie.averageRating =
      totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(1)) : 0;

    // Save the updated movie document with the new rating and average rating
    await movie.save();

    return {
      title: movie.title,
      averageRating: movie.averageRating,
      ratings: movie.ratings.map((r) => ({
        userId: r.user,
        rating: r.rating,
      })),
    };
  }
}
