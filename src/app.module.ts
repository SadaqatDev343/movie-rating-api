import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { MoviesModule } from './movies/movies.module';
import { CloudinaryModule } from './user/cloudinary.module';

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
  ],
})
export class AppModule {}
