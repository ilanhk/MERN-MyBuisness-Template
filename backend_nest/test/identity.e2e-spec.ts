import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/user-management/users/users.service';

process.env.ENABLE_INFRASTRUCTURE = 'false';
process.env.NODE_ENV = 'development';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.BASE_URL = 'http://localhost:7000/api';

const usersService = {
  findByEmail: jest.fn(async () => null),
  findByResetToken: jest.fn(async () => null),
};

describe('Identity recovery routes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects password reset when the token is invalid', async () => {
    await request(app.getHttpServer())
      .post('/api/users/reset-password')
      .send({ resetToken: 'invalid-token', newPassword: 'ValidPassword1!' })
      .expect(400);
  });

  it('requires an email for password reset requests', async () => {
    await request(app.getHttpServer())
      .post('/api/users/forgot-password')
      .send({})
      .expect(400);
  });

  it('requires a Google credential', async () => {
    await request(app.getHttpServer())
      .post('/api/google/authenticate')
      .send({})
      .expect(400);
  });
});
