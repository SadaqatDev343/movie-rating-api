import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { CloudinaryModule } from './cloudinary.module';
import { CloudinaryService } from './cloudinary.service';
import { JwtStrategy } from './JwtStrategy';

@Module({
  imports: [
    ConfigModule, // ✅ Ensure ConfigModule is imported
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY', 'movie_rating_api'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, CloudinaryService, JwtStrategy],
  exports: [UserService, PassportModule, JwtModule],
})
export class UserModule {}
