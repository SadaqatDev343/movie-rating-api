import { Module } from '@nestjs/common';
import { ServiceAController } from './app.controller';
import { ServiceAService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb+srv://msadaqatdev:BciyTZwmEcOKjVTw@cluster0.5vxaf.mongodb.net/',
    ),
  ],
  controllers: [ServiceAController],
  providers: [ServiceAService],
})
export class ServiceAModule {}
