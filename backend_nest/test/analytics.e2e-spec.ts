import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser = require('cookie-parser');
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/user-management/users/users.service';
import { AnalyticsService } from '../src/analytics/analytics.service';

process.env.ENABLE_INFRASTRUCTURE = 'false';
process.env.NODE_ENV = 'development';
process.env.JWT_SECRET_ACCESS = 'test-access-secret';
process.env.JWT_SECRET_REFRESH = 'test-refresh-secret';
process.env.ACCESS_TOKEN_NAME = 'accesstoken';
process.env.REFRESH_TOKEN_NAME = 'refreshtoken';
process.env.SESSION_SECRET = 'test-session-secret';

const employeeUser = {
  _id: '507f1f77bcf86cd799439011',
  id: '507f1f77bcf86cd799439011',
  firstName: 'Employee',
  lastName: 'User',
  fullName: 'Employee User',
  email: 'employee@example.com',
  password: 'hashed-password',
  isEmployee: true,
  isAdmin: false,
  isSuperAdmin: false,
  inEmailList: false,
  twoFaSecret: null,
  refreshToken: null,
};

const usersService = {
  findByEmail: jest.fn(async () => employeeUser),
  findById: jest.fn(async () => employeeUser),
  matchesPassword: jest.fn(async () => true),
  save: jest.fn(async (user: unknown) => user),
};

const analyticsService = {
  addProductClick: jest.fn(async () => ({ productId: '507f1f77bcf86cd799439011' })),
  addWebTraffic: jest.fn(async () => ({ url: '/home' })),
};

describe('Analytics routes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(UsersService).useValue(usersService)
      .overrideProvider(AnalyticsService).useValue(analyticsService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects product analytics without authentication', async () => {
    await request(app.getHttpServer())
      .post('/api/analytics/product')
      .send({ productId: '507f1f77bcf86cd799439011' })
      .expect(401);
  });

  it('allows employees to record product clicks', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/api/users/login')
      .send({ email: 'employee@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .post('/api/analytics/product')
      .send({ productId: '507f1f77bcf86cd799439011' })
      .expect(201)
      .expect((response) => {
        expect(response.body.productId).toBe('507f1f77bcf86cd799439011');
      });
  });

  it('rejects invalid product analytics payloads', async () => {
    analyticsService.addProductClick.mockRejectedValueOnce(new BadRequestException({ message: 'A valid productId is required' }));
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/api/users/login')
      .send({ email: 'employee@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .post('/api/analytics/product')
      .send({ productId: 'invalid' })
      .expect(400);
  });
});
