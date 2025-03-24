// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { MoviesModule } from './movies/movies.module';
import { CloudinaryModule } from './user/cloudinary.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationModule } from './recommendation/recommendation.module';

import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD to make the guard global
import { JwtStrategy } from './user/JwtStrategy';
import { JwtAuthGuard } from './user/jwt-auth.guard'; // Correct path to your guard

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb+srv://msadaqatdev:BciyTZwmEcOKjVTw@cluster0.5vxaf.mongodb.net/'
    ),
    UserModule,
    CloudinaryModule,
    CategoryModule,
    MoviesModule,
    RecommendationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy, // Provide the JwtStrategy
    {
      provide: APP_GUARD, // Apply the JwtAuthGuard globally
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
