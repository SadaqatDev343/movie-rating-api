import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ServiceAModule } from './app.module';

async function bootstrap() {
  // Create microservice for TCP communication
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(ServiceAModule, {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    });

  // Create HTTP application on a different port
  const app = await NestFactory.create(ServiceAModule);
  app.enableCors();

  // Start both servers
  await microservice.listen();
  await app.listen(4001);

  console.log('Service A microservice is running on port 3001');
  console.log('Service A HTTP is running on http://localhost:4001');
}
bootstrap();
