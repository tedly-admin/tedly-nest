import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from '../app/category/entities/category.entity';
import { DocumentEntity } from '../app/document/entities/document.entity';
import { BookEntity } from '../app/book/entities/book.entity';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      entities: [CategoryEntity, DocumentEntity, BookEntity],
      synchronize: false, // Set to false when using migrations
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([CategoryEntity, DocumentEntity, BookEntity]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, TypeOrmModule],
})
export class DatabaseModule {}
