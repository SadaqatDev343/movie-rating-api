import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (optional, for frontend integration)
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Movie Rating API')
    .setDescription('API documentation for Movie Rating Api')
    .setVersion('1.0')
    .addTag('User')
    .addBearerAuth() // For authorization
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();
