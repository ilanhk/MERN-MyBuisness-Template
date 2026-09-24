import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser = require('cookie-parser');
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/user-management/users/users.service';
import { ProductsService } from '../src/products/products.service';

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

const productsService = {
  findAll: jest.fn(async () => ({ selectedProducts: [{ name: 'Phone' }], page: 1, pages: 1 })),
  findById: jest.fn(async () => ({ name: 'Phone' })),
  create: jest.fn(async () => ({ name: 'Sample name' })),
  update: jest.fn(async () => ({ name: 'Updated phone' })),
  delete: jest.fn(async () => 'Product deleted'),
};

describe('Products routes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(UsersService).useValue(usersService)
      .overrideProvider(ProductsService).useValue(productsService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns public products', async () => {
    await request(app.getHttpServer())
      .get('/api/products?pageNumber=1&keyword=phone')
      .expect(200)
      .expect({ selectedProducts: [{ name: 'Phone' }], page: 1, pages: 1 });
  });

  it('rejects product creation without authentication', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .expect(401);
  });

  it('allows employees to create products', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/api/users/login')
      .send({ email: 'employee@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .post('/api/products')
      .expect(201)
      .expect({ name: 'Sample name' });
  });
});
