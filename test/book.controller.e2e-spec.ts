import { INestApplication } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from 'src/app/book/dto/book.dto';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  E2ETestSetup,
  setupE2ETest,
  teardownE2ETest,
} from './helper/e2e-test-setup.helper';

describe('BookController (e2e)', () => {
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

  describe('POST /books', () => {
    it('should create a book', () => {
      const createBookDto = {
        title: 'Test Book',
        description: 'Test Description',
        name: 'test-book',
      };

      return request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createBookDto.title);
          expect(res.body.description).toBe(createBookDto.description);
          expect(res.body.name).toBe(createBookDto.name);
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    it('should create a book with only title', () => {
      const createBookDto = {
        title: 'Test Book Title Only',
      };

      return request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createBookDto.title);
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    it('should create a book with all fields optional', () => {
      const createBookDto = {};

      return request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });
  });

  describe('GET /books', () => {
    it('should return an array of books', () => {
      return request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });

    it('should return all books', async () => {
      // Create test books
      const book1: CreateBookDto = {
        title: 'Book 1',
        description: 'Description 1',
        name: 'book-1',
      };
      const book2: CreateBookDto = {
        title: 'Book 2',
        description: 'Description 2',
        name: 'book-2',
      };

      await request(app.getHttpServer()).post('/books').send(book1).expect(201);

      await request(app.getHttpServer()).post('/books').send(book2).expect(201);

      return request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('title');
          expect(res.body[0]).toHaveProperty('description');
          expect(res.body[0]).toHaveProperty('name');
        });
    });
  });

  describe('GET /books/:id', () => {
    it('should return a book by id', async () => {
      // Create a book first
      const createBookDto = {
        title: 'Test Book',
        description: 'Test Description',
        name: 'test-book',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      const bookId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(bookId);
          expect(res.body.title).toBe(createBookDto.title);
          expect(res.body.description).toBe(createBookDto.description);
          expect(res.body.name).toBe(createBookDto.name);
        });
    });

    it('should return 404 when book does not exist', () => {
      return request(app.getHttpServer()).get('/books/99999').expect(404);
    });
  });

  describe('PATCH /books/:id', () => {
    it('should update a book', async () => {
      // Create a book first
      const createBookDto = {
        title: 'Test Book',
        description: 'Test Description',
        name: 'test-book',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      const bookId = createResponse.body.id;

      const updateBookDto = {
        title: 'Updated Book',
        description: 'Updated Description',
        name: 'updated-book',
      };

      return request(app.getHttpServer())
        .patch(`/books/${bookId}`)
        .send(updateBookDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(bookId);
          expect(res.body.title).toBe(updateBookDto.title);
          expect(res.body.description).toBe(updateBookDto.description);
          expect(res.body.name).toBe(updateBookDto.name);
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    // it('should update a book partially', async () => {
    //   // Create a book first
    //   const createBookDto = {
    //     title: 'Test Book',
    //     description: 'Test Description',
    //     name: 'test-book',
    //   };

    //   const createResponse = await request(app.getHttpServer())
    //     .post('/books')
    //     .send(createBookDto)
    //     .expect(201);

    //   const bookId = createResponse.body.id;

    //   const updateBookDto = {
    //     title: 'Updated Title Only',
    //   };

    //   return request(app.getHttpServer())
    //     .patch(`/books/${bookId}`)
    //     .send(updateBookDto)
    //     .expect(200)
    //     .expect((res) => {
    //       expect(res.body.id).toBe(bookId);
    //       expect(res.body.title).toBe(updateBookDto.title);
    //       expect(res.body.description).toBe(createBookDto.description);
    //       expect(res.body.name).toBe(createBookDto.name);
    //     });
    // });

    it('should return 404 when updating non-existent book', () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
      };

      return request(app.getHttpServer())
        .patch('/books/99999')
        .send(updateBookDto)
        .expect(404);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete a book', async () => {
      // Create a book first
      const createBookDto = {
        title: 'Test Book',
        description: 'Test Description',
        name: 'test-book',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      const bookId = createResponse.body.id;

      await request(app.getHttpServer()).delete(`/books/${bookId}`).expect(200);

      // Verify it's deleted
      return request(app.getHttpServer()).get(`/books/${bookId}`).expect(404);
    });

    it('should return 404 when deleting non-existent book', () => {
      return request(app.getHttpServer()).delete('/books/99999').expect(404);
    });
  });
});
