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

  async seedMovies() {
    const categoryIds = [
      '67def912390df5253f109d05', // Action
      '67def912390df5253f109d06', // Horror
      '67def913390df5253f109d07', // Comedy
      '67def913390df5253f109d08', // Animated
      '67defb0f390df5253f109d09', // Drama
      '67defb0f390df5253f109d0a', // Sci-Fi
      '67defb0f390df5253f109d0b', // Thriller
      '67defb0f390df5253f109d0c', // Romance
      '67defb0f390df5253f109d0d', // Mystery
      '67defb0f390df5253f109d0e', // Fantasy
    ];

    const movies = [
      {
        title: 'Inception',
        description: 'A thief enters dreams.',
        releaseYear: 2010,
        categories: [categoryIds[0], categoryIds[5]],
      },
      {
        title: 'Titanic',
        description: 'A romance on a doomed ship.',
        releaseYear: 1997,
        categories: [categoryIds[4], categoryIds[7]],
      },
      {
        title: 'The Dark Knight',
        description: 'Batman fights the Joker.',
        releaseYear: 2008,
        categories: [categoryIds[0], categoryIds[6]],
      },
      {
        title: 'Interstellar',
        description: 'A journey through space and time.',
        releaseYear: 2014,
        categories: [categoryIds[5], categoryIds[4]],
      },
      {
        title: 'The Matrix',
        description: 'A hacker discovers a hidden reality.',
        releaseYear: 1999,
        categories: [categoryIds[5], categoryIds[0]],
      },
      {
        title: 'Avatar',
        description: 'A man explores an alien planet.',
        releaseYear: 2009,
        categories: [categoryIds[5], categoryIds[9]],
      },
      {
        title: 'The Conjuring',
        description: 'A paranormal investigation story.',
        releaseYear: 2013,
        categories: [categoryIds[1], categoryIds[8]],
      },
      {
        title: 'Joker',
        description: "A man's descent into madness.",
        releaseYear: 2019,
        categories: [categoryIds[4], categoryIds[6]],
      },
      {
        title: 'Toy Story',
        description: 'Toys come to life.',
        releaseYear: 1995,
        categories: [categoryIds[3], categoryIds[2]],
      },
      {
        title: 'Finding Nemo',
        description: 'A fish searches for his son.',
        releaseYear: 2003,
        categories: [categoryIds[3], categoryIds[9]],
      },
      {
        title: 'The Lion King',
        description: "A lion cub's journey.",
        releaseYear: 1994,
        categories: [categoryIds[3], categoryIds[4]],
      },
      {
        title: 'Gladiator',
        description: 'A Roman general seeks revenge.',
        releaseYear: 2000,
        categories: [categoryIds[0], categoryIds[4]],
      },
      {
        title: 'The Godfather',
        description: 'The rise of a mafia family.',
        releaseYear: 1972,
        categories: [categoryIds[4], categoryIds[6]],
      },
      {
        title: 'Forrest Gump',
        description: 'A man’s journey through history.',
        releaseYear: 1994,
        categories: [categoryIds[4], categoryIds[7]],
      },
      {
        title: 'The Avengers',
        description: 'Superheroes unite to save Earth.',
        releaseYear: 2012,
        categories: [categoryIds[0], categoryIds[5]],
      },
      {
        title: 'Shutter Island',
        description: 'A detective investigates a mystery.',
        releaseYear: 2010,
        categories: [categoryIds[8], categoryIds[6]],
      },
      {
        title: 'Parasite',
        description: 'A poor family infiltrates a rich household.',
        releaseYear: 2019,
        categories: [categoryIds[4], categoryIds[8]],
      },
      {
        title: 'The Silence of the Lambs',
        description: 'An FBI agent seeks a killer.',
        releaseYear: 1991,
        categories: [categoryIds[8], categoryIds[6]],
      },
      {
        title: 'Frozen',
        description: 'A princess embraces her magic.',
        releaseYear: 2013,
        categories: [categoryIds[3], categoryIds[9]],
      },
      {
        title: 'Coco',
        description: 'A boy explores the Land of the Dead.',
        releaseYear: 2017,
        categories: [categoryIds[3], categoryIds[9]],
      },
      {
        title: 'Black Panther',
        description: 'A king defends his nation.',
        releaseYear: 2018,
        categories: [categoryIds[0], categoryIds[9]],
      },
      {
        title: 'Doctor Strange',
        description: 'A surgeon turns into a sorcerer.',
        releaseYear: 2016,
        categories: [categoryIds[5], categoryIds[9]],
      },
      {
        title: 'Deadpool',
        description: 'A mercenary gains superpowers.',
        releaseYear: 2016,
        categories: [categoryIds[0], categoryIds[2]],
      },
      {
        title: 'The Prestige',
        description: 'Magicians battle for supremacy.',
        releaseYear: 2006,
        categories: [categoryIds[8], categoryIds[6]],
      },
      {
        title: 'IT',
        description: 'A group of kids faces a terrifying clown.',
        releaseYear: 2017,
        categories: [categoryIds[1], categoryIds[8]],
      },
      {
        title: 'The Shining',
        description: 'A haunted hotel drives a man insane.',
        releaseYear: 1980,
        categories: [categoryIds[1], categoryIds[6]],
      },
      {
        title: 'Django Unchained',
        description: 'A freed slave seeks revenge.',
        releaseYear: 2012,
        categories: [categoryIds[0], categoryIds[4]],
      },
      {
        title: 'Mad Max: Fury Road',
        description: 'Survival in a post-apocalyptic world.',
        releaseYear: 2015,
        categories: [categoryIds[0], categoryIds[6]],
      },
      {
        title: 'Logan',
        description: "Wolverine's final chapter.",
        releaseYear: 2017,
        categories: [categoryIds[0], categoryIds[4]],
      },
      {
        title: 'John Wick',
        description: 'A hitman seeks vengeance.',
        releaseYear: 2014,
        categories: [categoryIds[0], categoryIds[6]],
      },
      {
        title: 'No Country for Old Men',
        description: 'A chase for stolen money.',
        releaseYear: 2007,
        categories: [categoryIds[6], categoryIds[8]],
      },
      {
        title: 'The Wolf of Wall Street',
        description: "A stockbroker's rise and fall.",
        releaseYear: 2013,
        categories: [categoryIds[4], categoryIds[2]],
      },
      {
        title: 'The Revenant',
        description: 'A man fights for survival.',
        releaseYear: 2015,
        categories: [categoryIds[4], categoryIds[0]],
      },
      {
        title: 'Her',
        description: 'A man falls in love with an AI.',
        releaseYear: 2013,
        categories: [categoryIds[4], categoryIds[7]],
      },
      {
        title: 'Soul',
        description: "A jazz musician's journey in the afterlife.",
        releaseYear: 2020,
        categories: [categoryIds[3], categoryIds[9]],
      },
      {
        title: 'Luca',
        description: 'A sea monster experiences human life.',
        releaseYear: 2021,
        categories: [categoryIds[3], categoryIds[9]],
      },
    ];

    await this.movieModel.insertMany(movies);
    return { message: '50 movies seeded successfully!' };
  }
}
