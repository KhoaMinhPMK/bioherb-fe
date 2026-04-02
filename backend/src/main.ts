import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('SANKIT API')
    .setDescription('Agricultural management platform API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & Authorization')
    .addTag('users', 'User management')
    .addTag('cooperatives', 'Cooperative management')
    .addTag('farms', 'Farm management')
    .addTag('plots', 'Plot management')
    .addTag('crop-cycles', 'Crop cycle management')
    .addTag('task-plans', 'Task planning')
    .addTag('task-logs', 'Task logging & approval')
    .addTag('workers', 'Worker management')
    .addTag('equipment', 'Equipment management')
    .addTag('input-items', 'Input items & inventory')
    .addTag('harvest', 'Harvest batches')
    .addTag('lots', 'Product lots & QR')
    .addTag('pest-incidents', 'Pest & disease incidents')
    .addTag('gacp', 'GACP diary entries')
    .addTag('attendance', 'Attendance records')
    .addTag('notifications', 'User notifications')
    .addTag('feature-flags', 'Feature flag management')
    .addTag('dashboard', 'Dashboard aggregation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 SANKIT API running on port ${port}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
