import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('SystemStatusController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/system-status (GET)', () => {
    const httpServer = app.getHttpServer() as Server;

    return request(httpServer)
      .get('/api/system-status')
      .expect(200)
      .expect(({ body }: { body: Record<string, unknown> }) => {
        expect(body.name).toBe('backend');
        expect(body.status).toBe('ok');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('creates and closes a project', async () => {
    const httpServer = app.getHttpServer() as Server;

    const createdProjectResponse = await request(httpServer)
      .post('/api/projects')
      .send({
        name: 'Proyecto de prueba',
        description: 'Proyecto para validar cierre',
      })
      .expect(201);

    const createdProjectBody = createdProjectResponse.body as Record<
      string,
      unknown
    >;

    expect(createdProjectBody.status).toBe('abierto');

    const createdProjectId = createdProjectBody.id;

    expect(typeof createdProjectId).toBe('string');

    if (typeof createdProjectId !== 'string') {
      throw new Error('Expected project id to be a string.');
    }

    const closedProjectResponse = await request(httpServer)
      .patch(`/api/projects/${createdProjectId}/close`)
      .expect(200);

    const closedProjectBody = closedProjectResponse.body as Record<
      string,
      unknown
    >;

    expect(closedProjectBody.status).toBe('cerrado');
    expect(typeof closedProjectBody.closedAt).toBe('string');
  });

  afterEach(async () => {
    await app.close();
  });
});
