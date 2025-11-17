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
import { DocumentService } from './document.service';
import {
  CreateDocumentDto,
  DocumentResponseDto,
  UpdateDocumentDto,
} from './dto/document.dto';
import { DocumentEntity } from './entities/document.entity';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  private toDto(entity: DocumentEntity): DocumentResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  @Post()
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentResponseDto> {
    const document = await this.documentService.create(createDocumentDto);
    return this.toDto(document);
  }

  @Get()
  async findAll(): Promise<DocumentResponseDto[]> {
    const documents = await this.documentService.findAll();
    return documents.map((document) => this.toDto(document));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DocumentResponseDto> {
    const document = await this.documentService.findOne(id);
    return this.toDto(document);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentResponseDto> {
    const document = await this.documentService.update(id, updateDocumentDto);
    return this.toDto(document);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.documentService.remove(id);
  }
}
