import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  E2ETestSetup,
  setupE2ETest,
  teardownE2ETest,
} from './helper/e2e-test-setup.helper';
import { CreateDocumentDto } from 'src/app/document/dto/document.dto';

describe('DocumentController (e2e)', () => {
  let app: INestApplication<App>;
  let testSetup: E2ETestSetup;

  beforeAll(async () => {
    testSetup = await setupE2ETest();
    app = testSetup.app;
  });

  afterEach(async () => {});

  afterAll(async () => {
    await teardownE2ETest(testSetup);
  });

  describe('POST /documents', () => {
    it('should create a document', () => {
      const createDocumentDto = {
        name: 'Test Document',
        type: 'pdf',
      };

      return request(app.getHttpServer())
        .post('/documents')
        .send(createDocumentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createDocumentDto.name);
          expect(res.body.type).toBe(createDocumentDto.type);
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    it('should create a document with all fields', () => {
      const createDocumentDto = {
        name: 'Test Document',
        type: 'pdf',
        created_by_id: 1,
        updated_by_id: 1,
      };

      return request(app.getHttpServer())
        .post('/documents')
        .send(createDocumentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createDocumentDto.name);
          expect(res.body.type).toBe(createDocumentDto.type);
          expect(res.body.created_by_id).toBe(createDocumentDto.created_by_id);
          expect(res.body.updated_by_id).toBe(createDocumentDto.updated_by_id);
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    it('should create a document with minimal fields', () => {
      const createDocumentDto: CreateDocumentDto = {
        name: 'Test Document',
      };

      return request(app.getHttpServer())
        .post('/documents')
        .send(createDocumentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });
  });

  describe('GET /documents', () => {
    it('should return an array of documents', () => {
      return request(app.getHttpServer())
        .get('/documents')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });

    it('should return all documents', async () => {
      // Create test documents
      const document1 = {
        name: 'Document 1',
        type: 'pdf',
      };
      const document2 = {
        name: 'Document 2',
        type: 'docx',
      };

      await request(app.getHttpServer())
        .post('/documents')
        .send(document1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/documents')
        .send(document2)
        .expect(201);

      return request(app.getHttpServer())
        .get('/documents')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('type');
        });
    });
  });

  describe('GET /documents/:id', () => {
    it('should return a document by id', async () => {
      // Create a document first
      const createDocumentDto = {
        name: 'Test Document',
        type: 'pdf',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/documents')
        .send(createDocumentDto)
        .expect(201);

      const documentId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/documents/${documentId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(documentId);
          expect(res.body.name).toBe(createDocumentDto.name);
          expect(res.body.type).toBe(createDocumentDto.type);
        });
    });

    it('should return 404 when document does not exist', () => {
      return request(app.getHttpServer()).get('/documents/99999').expect(404);
    });
  });

  describe('PATCH /documents/:id', () => {
    it('should update a document', async () => {
      // Create a document first
      const createDocumentDto = {
        name: 'Test Document',
        type: 'pdf',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/documents')
        .send(createDocumentDto)
        .expect(201);

      const documentId = createResponse.body.id;

      const updateDocumentDto = {
        name: 'Updated Document',
        type: 'docx',
      };

      return request(app.getHttpServer())
        .patch(`/documents/${documentId}`)
        .send(updateDocumentDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(documentId);
          expect(res.body.name).toBe(updateDocumentDto.name);
          expect(res.body.type).toBe(updateDocumentDto.type);
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    it('should return 404 when updating non-existent document', () => {
      const updateDocumentDto = {
        name: 'Updated Document',
      };

      return request(app.getHttpServer())
        .patch('/documents/99999')
        .send(updateDocumentDto)
        .expect(404);
    });
  });

  describe('DELETE /documents/:id', () => {
    it('should delete a document', async () => {
      // Create a document first
      const createDocumentDto = {
        name: 'Test Document',
        type: 'pdf',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/documents')
        .send(createDocumentDto)
        .expect(201);

      const documentId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/documents/${documentId}`)
        .expect(200);

      // Verify it's deleted
      return request(app.getHttpServer())
        .get(`/documents/${documentId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent document', () => {
      return request(app.getHttpServer())
        .delete('/documents/99999')
        .expect(404);
    });
  });
});
