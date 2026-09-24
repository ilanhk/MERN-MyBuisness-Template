import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser = require('cookie-parser');
import session = require('express-session');
import express = require('express');
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('port', 5000);
  const frontendOrigin = config.get<string>('frontendOrigin', 'http://localhost:5173');
  const sessionSecret = config.get<string>('SESSION_SECRET');

  if (!sessionSecret) {
    throw new Error('SESSION_SECRET must be set before starting the NestJS backend.');
  }

  app.setGlobalPrefix('api');
  app.getHttpAdapter().getInstance().use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use(cookieParser());
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  }));
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(port);
  console.log(`NestJS server is running on port ${port}`);
}

void bootstrap();
