import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryResponseDto {
  id: number;
  name: string;
  entity: string;
  created_at: Date;
  updated_at: Date;
}

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  entity: string;
}

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  entity: string;
}
