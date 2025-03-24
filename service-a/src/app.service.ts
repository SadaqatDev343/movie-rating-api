import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ServiceAService {
  private readonly mongoUri = process.env.MONGO_URI;

  async serviceA(userId: string): Promise<string> {
    let connection = null;

    try {
      if (!userId || typeof userId !== 'string' || userId.length !== 24) {
        console.log(`Invalid userId format: ${userId}`);
        return JSON.stringify([]);
      }

      connection = await mongoose.connect(this.mongoUri);

      if (!connection || !connection.connection || !connection.connection.db) {
        throw new Error('Failed to establish database connection');
      }

      const db = connection.connection.db;

      let user;
      try {
        user = await db
          .collection('users')
          .findOne({ _id: new mongoose.Types.ObjectId(userId) });
      } catch (error) {
        console.error(`Error finding user with ID: ${userId}`, error);
        return JSON.stringify([]);
      }

      if (!user || !user.categories || user.categories.length === 0) {
        console.log(
          `User not found or has no favorite categories for ID: ${userId}`
        );
        return JSON.stringify([]);
      }

      const userCategories = user.categories.map((cat) =>
        typeof cat === 'string' ? cat : cat.toString()
      );
      console.log('User Categories:', userCategories);

      const allMovies = await db.collection('movies').find({}).toArray();

      const categories = await db.collection('categories').find({}).toArray();
      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat._id.toString()] = cat.name;
        return acc;
      }, {});

      const result = [];

      for (const categoryId of userCategories) {
        const moviesInCategory = allMovies.filter(
          (movie) =>
            movie.categories &&
            Array.isArray(movie.categories) &&
            movie.categories.some(
              (cat) => cat && cat.toString && cat.toString() === categoryId
            )
        );

        moviesInCategory.sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );

        const topTwoMovies = moviesInCategory.slice(0, 2);

        topTwoMovies.forEach((movie) => {
          const categoryName = categoryMap[categoryId] || 'Unknown';
          result.push({
            title: movie.title || 'N/A',
            description: movie.description || 'N/A',
            releaseYear: movie.releaseYear || 'N/A',
            averageRating: movie.averageRating || '0',
            categories: categoryName,
          });
        });
      }

      console.log('Top 2 Movies Per Category:');
      console.log(JSON.stringify(result, null, 2));

      return JSON.stringify(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      return JSON.stringify([]);
    } finally {
      if (connection) {
        try {
          await mongoose.disconnect();
        } catch (error) {
          console.error('Error disconnecting from MongoDB:', error);
        }
      }
    }
  }
}
