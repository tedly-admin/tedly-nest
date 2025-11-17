import { INestApplication } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/app/category/dto/category.dto';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  E2ETestSetup,
  setupE2ETest,
  teardownE2ETest,
} from './helper/e2e-test-setup.helper';

describe('CategoryController (e2e)', () => {
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

  describe('POST /categories', () => {
    it('should create a category', () => {
      const createCategoryDto = {
        name: 'Test Category',
        entity: 'test-entity',
      };

      return request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createCategoryDto.name);
          expect(res.body.entity).toBe(createCategoryDto.entity);
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    it('should fail validation when name is missing', () => {
      const createCategoryDto = {
        entity: 'test-entity',
      };

      return request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(400);
    });

    it('should fail validation when name is empty', () => {
      const createCategoryDto = {
        name: '',
        entity: 'test-entity',
      };

      return request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(400);
    });
  });

  describe('GET /categories', () => {
    it('should return an array of 1 category', () => {
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body).toHaveLength(1);
        });
    });

    it('should return all categories', async () => {
      // Create test categories
      const category1 : CreateCategoryDto = {
        name: 'Category 1',
        entity: 'entity-1',
      };
      const category2 : CreateCategoryDto = {
        name: 'Category 2',
        entity: 'entity-2',
      };

      await request(app.getHttpServer())
        .post('/categories')
        .send(category1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/categories')
        .send(category2)
        .expect(201);

      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('entity');
        });
    });
  });

  describe('GET /categories/:id', () => {
    it('should return a category by id', async () => {
      // Create a category first
      const createCategoryDto = {
        name: 'Test Category',
        entity: 'test-entity',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201);

      const categoryId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/categories/${categoryId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(categoryId);
          expect(res.body.name).toBe(createCategoryDto.name);
          expect(res.body.entity).toBe(createCategoryDto.entity);
        });
    });

    it('should return 404 when category does not exist', () => {
      return request(app.getHttpServer()).get('/categories/99999').expect(404);
    });
  });

  describe('PATCH /categories/:id', () => {
    it('should update a category', async () => {
      // Create a category first
      const createCategoryDto = {
        name: 'Test Category',
        entity: 'test-entity',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201);

      const categoryId = createResponse.body.id;

      const updateCategoryDto = {
        name: 'Updated Category',
        entity: 'updated-entity',
      };

      return request(app.getHttpServer())
        .patch(`/categories/${categoryId}`)
        .send(updateCategoryDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(categoryId);
          expect(res.body.name).toBe(updateCategoryDto.name);
          expect(res.body.entity).toBe(updateCategoryDto.entity);
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    it('should return 404 when updating non-existent category', () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
        entity: 'updated-entity',
      };

      return request(app.getHttpServer())
        .patch('/categories/99999')
        .send(updateCategoryDto)
        .expect(404);
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should delete a category', async () => {
      // Create a category first
      const createCategoryDto = {
        name: 'Test Category',
        entity: 'test-entity',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201);

      const categoryId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/categories/${categoryId}`)
        .expect(200);

      // Verify it's deleted
      return request(app.getHttpServer())
        .get(`/categories/${categoryId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent category', () => {
      return request(app.getHttpServer())
        .delete('/categories/99999')
        .expect(404);
    });
  });
});
