import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Nuxt frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Global prefix for all API routes
  app.setGlobalPrefix('api');

  const port = process.env.API_PORT || 3001;
  await app.listen(port);

  console.log(`🚀 ArcTube API running on http://localhost:${port}`);
  console.log(`📡 Arc Testnet: ${process.env.ARC_RPC_URL || 'not configured'}`);
}

bootstrap();
