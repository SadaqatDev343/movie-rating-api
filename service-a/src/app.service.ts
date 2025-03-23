import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ServiceAService {
  private readonly mongoUri = process.env.MONGO_URI;

  async serviceA(userId: string): Promise<string> {
    try {
      const connection = await mongoose.connect(this.mongoUri);
      const db = connection.connection.db;

      // Fetch user
      const user = await db
        .collection('users')
        .findOne({ _id: new mongoose.Types.ObjectId(userId) });

      if (!user || !user.categories || user.categories.length === 0) {
        console.log(
          `User not found or has no favorite categories for ID: ${userId}`,
        );
        return JSON.stringify([]);
      }

      const userCategoryIds = user.categories.map((cat) =>
        typeof cat === 'string' ? cat : cat.toString(),
      );

      // Fetch categories and create a mapping of ID -> Name
      const categories = await db.collection('categories').find({}).toArray();
      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat._id.toString()] = cat.name;
        return acc;
      }, {});

      console.log(`Category Mapping:`, categoryMap);

      // Fetch movies
      const movies = await db
        .collection('movies')
        .find({ categories: { $in: userCategoryIds } })
        .toArray();

      if (!movies || movies.length === 0) {
        console.log('No movies found for user categories');
        return JSON.stringify([]);
      }

      // Format movies data in the exact structure requested
      const formattedMovies = movies.map((movie) => {
        // Get primary category (first one or use the first found in the map)
        const primaryCategory =
          movie.categories && movie.categories.length > 0
            ? categoryMap[movie.categories[0].toString()] || 'Unknown'
            : 'Unknown';

        return {
          title: movie.title || '',
          description: movie.description || '',
          releaseYear: movie.releaseYear || 0,
          categories: primaryCategory, // Using a single category string instead of comma-separated
          averageRating: movie.averageRating || 5,
        };
      });

      console.log(
        'Formatted Movie Data:',
        JSON.stringify(formattedMovies, null, 2),
      );
      return JSON.stringify(formattedMovies);
    } catch (error) {
      console.error('Error fetching data:', error);
      return JSON.stringify([]); // Return empty array on error
    } finally {
      await mongoose.disconnect();
    }
  }
}
