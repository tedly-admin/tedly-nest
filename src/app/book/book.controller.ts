import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookResponseDto, CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { BookEntity } from './entities/book.entity';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  private toDto(entity: BookEntity): BookResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      name: entity.name,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<BookResponseDto> {
    const book = await this.bookService.create(createBookDto);
    return this.toDto(book);
  }

  @Get()
  async findAll(): Promise<BookResponseDto[]> {
    const books = await this.bookService.findAll();
    return books.map((book) => this.toDto(book));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookResponseDto> {
    const book = await this.bookService.findOne(id);
    return this.toDto(book);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    const book = await this.bookService.update(id, updateBookDto);
    return this.toDto(book);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.bookService.remove(id);
  }
}
