import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';

process.env.ENABLE_INFRASTRUCTURE = 'false';
process.env.NODE_ENV = 'development';
process.env.SESSION_SECRET = 'test-session-secret';

describe('Upload routes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('uploads a supported file', async () => {
    await request(app.getHttpServer())
      .post('/api/upload/file')
      .attach('file', Buffer.from('file contents'), { filename: 'document.pdf', contentType: 'application/pdf' })
      .expect(200)
      .expect((response) => {
        expect(response.body.fileUrl).toMatch(/^\/uploads\/file-/);
      });
  });

  it('parses an uploaded CSV file', async () => {
    await request(app.getHttpServer())
      .post('/api/upload/csv')
      .attach('file', Buffer.from('name,role\nIlan,Developer\n'), { filename: 'people.csv', contentType: 'text/csv' })
      .expect(200)
      .expect({ data: [{ name: 'Ilan', role: 'Developer' }] });
  });

  it('rejects unsupported file types', async () => {
    await request(app.getHttpServer())
      .post('/api/upload/file')
      .attach('file', Buffer.from('not allowed'), { filename: 'script.exe', contentType: 'application/octet-stream' })
      .expect(500);
  });
});
