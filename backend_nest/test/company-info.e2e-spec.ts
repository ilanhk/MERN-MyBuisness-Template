import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser = require('cookie-parser');
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/user-management/users/users.service';
import { CompanyInfoService } from '../src/company-info/company-info.service';

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

const companyInfoService = {
  findAll: jest.fn(async () => [{ _id: 'company-1', company: { name: 'MyBusiness' } }]),
  findById: jest.fn(async () => ({ _id: 'company-1', company: { name: 'MyBusiness' } })),
  create: jest.fn(async () => ({ _id: 'company-1' })),
  update: jest.fn(async () => ({ _id: 'company-1', company: { name: 'Updated' } })),
  delete: jest.fn(async () => ({ message: 'Company Info deleted successfuly' })),
};

describe('Company Info routes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(UsersService).useValue(usersService)
      .overrideProvider(CompanyInfoService).useValue(companyInfoService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns public company information', async () => {
    await request(app.getHttpServer())
      .get('/api/companyInfo')
      .expect(200)
      .expect([{ _id: 'company-1', company: { name: 'MyBusiness' } }]);
  });

  it('rejects updates without authentication', async () => {
    await request(app.getHttpServer())
      .put('/api/companyInfo/company-1')
      .send({ company: { name: 'Changed' } })
      .expect(401);
  });

  it('allows employees to update company information', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/api/users/login')
      .send({ email: 'employee@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .put('/api/companyInfo/company-1')
      .send({ company: { name: 'Updated' } })
      .expect(200)
      .expect((response) => {
        expect(response.body.company.name).toBe('Updated');
      });
  });
});
