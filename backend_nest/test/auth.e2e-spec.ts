import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/user-management/users/users.service';
import cookieParser = require('cookie-parser');
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

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
  save: jest.fn(async function (this: unknown) { return this; }),
};
const adminUser = { ...fakeUser, isAdmin: true };

describe('Auth routes', () => {
  let app: INestApplication;

  const usersService: any = {
    findByEmail: jest.fn(async () => null),
    findById: jest.fn(async () => fakeUser),
    create: jest.fn(async () => ({ ...fakeUser })),
    matchesPassword: jest.fn(async () => true),
    save: jest.fn(async (user: unknown) => user),
    updateProfile: jest.fn(async () => fakeUser),
    findAll: jest.fn(async () => [{ ...adminUser, password: undefined, refreshToken: undefined }]),
    findSafeById: jest.fn(async () => adminUser),
    updateUser: jest.fn(async () => adminUser),
    deleteUser: jest.fn(async () => undefined),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
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

  it('registers a user and sets authentication cookies', async () => {
    await request(app.getHttpServer())
      .post('/api/users')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'ValidPassword1!',
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.email).toBe('test@example.com');
        expect(response.body.accessToken).toEqual(expect.any(String));
        expect(response.headers['set-cookie']).toEqual(expect.arrayContaining([
          expect.stringContaining('accesstoken='),
          expect.stringContaining('refreshtoken='),
        ]));
      });
  });

  it('rejects invalid login credentials', async () => {
    usersService.findByEmail.mockResolvedValueOnce(null);

    await request(app.getHttpServer())
      .post('/api/users/login')
      .send({ email: 'missing@example.com', password: 'WrongPassword1!' })
      .expect(401)
      .expect({ message: 'Invalid Email or Password' });
  });

  it('logs out and clears authentication cookies', async () => {
    await request(app.getHttpServer())
      .post('/api/users/logout')
      .expect(200)
      .expect({ message: 'Logged out successfully' });
  });

  it('rejects profile access without an access cookie', async () => {
    await request(app.getHttpServer())
      .get('/api/users/profile')
      .expect(401);
  });

  it('uses access and refresh cookies for protected routes', async () => {
    usersService.findByEmail.mockResolvedValue(fakeUser);
    usersService.findById.mockResolvedValue(fakeUser);
    const agent = request.agent(app.getHttpServer());

    await agent
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .get('/api/users/profile')
      .expect(200)
      .expect((response) => {
        expect(response.body.email).toBe('test@example.com');
      });

    await agent
      .get('/api/users/refresh')
      .expect(200)
      .expect((response) => {
        expect(response.body.email).toBe('test@example.com');
        expect(response.body.accessToken).toEqual(expect.any(String));
      });
  });

  it('denies profile updates to non-admin users', async () => {
    usersService.findByEmail.mockResolvedValue(fakeUser);
    usersService.findById.mockResolvedValue(fakeUser);
    const agent = request.agent(app.getHttpServer());

    await agent
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .put('/api/users/profile')
      .send({ firstName: 'Changed' })
      .expect(401);
  });

  it('allows profile updates for admin users', async () => {
    usersService.findByEmail.mockResolvedValue(adminUser);
    usersService.findById.mockResolvedValue(adminUser);
    usersService.updateProfile.mockResolvedValue(adminUser);
    const agent = request.agent(app.getHttpServer());

    await agent
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .put('/api/users/profile')
      .send({ firstName: 'Changed' })
      .expect(200)
      .expect((response) => {
        expect(response.body.email).toBe('test@example.com');
      });
  });

  it('denies user listing to non-admin users', async () => {
    usersService.findByEmail.mockResolvedValue(fakeUser);
    usersService.findById.mockResolvedValue(fakeUser);
    const agent = request.agent(app.getHttpServer());

    await agent
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .get('/api/users')
      .expect(401);
  });

  it('allows admins to list users without password fields', async () => {
    usersService.findByEmail.mockResolvedValue(adminUser);
    usersService.findById.mockResolvedValue(adminUser);
    const agent = request.agent(app.getHttpServer());

    await agent
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'ValidPassword1!' })
      .expect(200);

    await agent
      .get('/api/users')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(1);
        expect(response.body[0].password).toBeUndefined();
      });
  });
});
