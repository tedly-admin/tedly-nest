import { IsOptional, IsString } from 'class-validator';

export class BookResponseDto {
  id: number;
  title: string;
  description: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export class CreateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
