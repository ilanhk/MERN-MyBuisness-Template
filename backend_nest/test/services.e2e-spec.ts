import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser = require('cookie-parser');
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/user-management/users/users.service';
import { ServicesService } from '../src/services/services.service';

process.env.ENABLE_INFRASTRUCTURE = 'false';
process.env.NODE_ENV = 'development';
process.env.JWT_SECRET_ACCESS = 'test-access-secret';
process.env.JWT_SECRET_REFRESH = 'test-refresh-secret';
process.env.ACCESS_TOKEN_NAME = 'accesstoken';
process.env.REFRESH_TOKEN_NAME = 'refreshtoken';
process.env.SESSION_SECRET = 'test-session-secret';

const adminUser = {
  _id: '507f1f77bcf86cd799439011',
  id: '507f1f77bcf86cd799439011',
  firstName: 'Admin',
  lastName: 'User',
  fullName: 'Admin User',
  email: 'admin@example.com',
  password: 'hashed-password',
  isEmployee: false,
  isAdmin: true,
  isSuperAdmin: false,
  inEmailList: false,
  twoFaSecret: null,
  refreshToken: null,
};

const usersService = {
  findByEmail: jest.fn(async () => adminUser),
  findById: jest.fn(async () => adminUser),
  matchesPassword: jest.fn(async () => true),
  save: jest.fn(async (user: unknown) => user),
};

const servicesService = {
  findAll: jest.fn(async () => [{ name: 'Consulting' }]),
  findById: jest.fn(async () => ({ name: 'Consulting' })),
  create: jest.fn(async () => ({ name: 'Consulting' })),
  update: jest.fn(async () => ({ name: 'Updated consulting' })),
  delete: jest.fn(async () => ({ message: 'Service deleted successfuly' })),
};

describe('Services routes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(UsersService).useValue(usersService)
      .overrideProvider(ServicesService).useValue(servicesService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns public services', async () => {
    await request(app.getHttpServer())
      .get('/api/services')
      .expect(200)
      .expect([{ name: 'Consulting' }]);
  });

  it('rejects service creation without authentication', async () => {
    await request(app.getHttpServer())
      .post('/api/services')
      .send({ name: 'Consulting', image: '/consulting.jpg', description: 'Advice' })
      .expect(401);
  });

  it('allows admins to create services', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/api/users/login')
      .send({ email: 'admin@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .post('/api/services')
      .send({ name: 'Consulting', image: '/consulting.jpg', description: 'Advice' })
      .expect(201)
      .expect({ name: 'Consulting' });
  });
});
