import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DocumentResponseDto {
  id: number;
  name: string;
  type: string;
  created_by_id: number;
  updated_by_id: number;
  created_at: Date;
  updated_at: Date;
}

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  created_by_id?: number;

  @IsOptional()
  @IsInt()
  updated_by_id?: number;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  created_by_id?: number;

  @IsOptional()
  @IsInt()
  updated_by_id?: number;
}
