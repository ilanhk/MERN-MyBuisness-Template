import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser = require('cookie-parser');
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/user-management/users/users.service';
import { WebsiteStylesService } from '../src/website-styles/website-styles.service';

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

const stylesService = {
  findAll: jest.fn(async () => [{ general: { backgroundColor: '#fff' } }]),
  findById: jest.fn(async () => ({ general: { backgroundColor: '#fff' } })),
  create: jest.fn(async () => ({ general: { backgroundColor: '#fff' } })),
  update: jest.fn(async () => ({ general: { backgroundColor: '#000' } })),
  delete: jest.fn(async () => ({ message: 'websiteStyles deleted successfuly' })),
};

describe('Website Styles routes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(UsersService).useValue(usersService)
      .overrideProvider(WebsiteStylesService).useValue(stylesService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns public website styles', async () => {
    await request(app.getHttpServer())
      .get('/api/website-styles')
      .expect(200)
      .expect([{ general: { backgroundColor: '#fff' } }]);
  });

  it('rejects style updates without authentication', async () => {
    await request(app.getHttpServer())
      .put('/api/website-styles/styles-1')
      .send({ general: { backgroundColor: '#000' } })
      .expect(401);
  });

  it('allows employees to update website styles', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/api/users/login')
      .send({ email: 'employee@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .put('/api/website-styles/styles-1')
      .send({ general: { backgroundColor: '#000' } })
      .expect(200)
      .expect((response) => {
        expect(response.body.general.backgroundColor).toBe('#000');
      });
  });
});
