import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './app/category/category.module';
import { DocumentModule } from './app/document/document.module';
import { BookModule } from './app/book/book.module';

@Module({
  imports: [DatabaseModule, CategoryModule, DocumentModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
