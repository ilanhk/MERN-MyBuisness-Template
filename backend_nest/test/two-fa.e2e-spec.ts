import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser = require('cookie-parser');
import * as speakeasy from 'speakeasy';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/user-management/users/users.service';

process.env.ENABLE_INFRASTRUCTURE = 'false';
process.env.NODE_ENV = 'development';
process.env.JWT_SECRET_ACCESS = 'test-access-secret';
process.env.JWT_SECRET_REFRESH = 'test-refresh-secret';
process.env.ACCESS_TOKEN_NAME = 'accesstoken';
process.env.REFRESH_TOKEN_NAME = 'refreshtoken';
process.env.SESSION_SECRET = 'test-session-secret';

const fakeUser = {
  _id: '507f1f77bcf86cd799439011',
  id: '507f1f77bcf86cd799439011',
  firstName: 'Test',
  lastName: 'User',
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'hashed-password',
  isEmployee: false,
  isAdmin: false,
  isSuperAdmin: false,
  inEmailList: false,
  twoFaSecret: null,
  refreshToken: null,
};

describe('Two-factor routes', () => {
  let app: INestApplication;
  const usersService: any = {
    findByEmail: jest.fn(async () => fakeUser),
    findById: jest.fn(async () => fakeUser),
    matchesPassword: jest.fn(async () => true),
    save: jest.fn(async (user: unknown) => user),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('generates a QR code for an authenticated user', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .get('/api/2fa/generate')
      .expect(200)
      .expect((response) => {
        expect(response.body.qrCode).toEqual(expect.stringContaining('data:image/'));
        expect(response.body.user.email).toBe('test@example.com');
      });
  });

  it('verifies a valid OTP for an authenticated user', async () => {
    fakeUser.twoFaSecret = null;
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'ValidPassword1!' })
      .expect(200);

    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    const token = speakeasy.totp({ secret, encoding: 'base32' });

    await agent
      .post('/api/2fa/verify')
      .send({ token, secret })
      .expect(200)
      .expect({ success: true, message: 'OTP verified successfully!' });
  });
});
