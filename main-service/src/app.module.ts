import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { MoviesModule } from './movies/movies.module';
import { CloudinaryModule } from './user/cloudinary.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller'; // Import your controller
import { AppService } from './app.service'; // Import your service
import { RecommendationModule } from './recommendation/recommendation.module';

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
  controllers: [AppController], // Controllers should be outside the imports array
  providers: [AppService], // Providers should be outside the imports array
})
export class AppModule {}
