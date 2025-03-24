import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ServiceAService {
  private readonly mongoUri = process.env.MONGO_URI;

  async serviceA(userId: string): Promise<string> {
    try {
      // Reuse existing connection if available
      if (!mongoose.connection.readyState) {
        await mongoose.connect(this.mongoUri);
      }
      const db = mongoose.connection.db;

      // Fetch user
      const user = await db
        .collection('users')
        .findOne({ _id: new mongoose.Types.ObjectId(userId) });

      if (!user || !user.categories || user.categories.length === 0) {
        console.log(
          `User not found or has no favorite categories for ID: ${userId}`
        );
        return JSON.stringify([]);
      }

      // Get user categories as strings (no conversion to ObjectId)
      const userCategories = user.categories.map((cat) =>
        typeof cat === 'string' ? cat : cat.toString()
      );
      console.log('User Categories:', userCategories);

      // Fetch all movies from the 'movies' collection and filter by user categories
      const allMovies = await db.collection('movies').find({}).toArray();

      // Filter movies that match user categories
      const filteredMovies = allMovies.filter((movie) =>
        movie.categories.some((cat) => userCategories.includes(cat.toString()))
      );

      // Log filtered movies data
      console.log('Filtered Movies:');
      console.log(JSON.stringify(filteredMovies, null, 2));

      // Format the filtered movies to include specific details
      const formattedMovies = filteredMovies.map((movie) => ({
        title: movie.title || 'N/A',
        description: movie.description || 'N/A',
        releaseYear: movie.releaseYear || 'N/A',
        averageRating: movie.averageRating || '0',
        categories: movie.categories || 'N/A',
      }));

      console.log('Formatted Filtered Movie Data:');
      console.log(JSON.stringify(formattedMovies, null, 2));

      return JSON.stringify(formattedMovies); // Return formatted filtered movie data
    } catch (error) {
      console.error('Error fetching data:', error);
      return JSON.stringify([]);
    }
  }
}
