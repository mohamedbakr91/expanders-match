// src/research/dto/create-research-document.dto.ts
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class CreateResearchDocumentDto {
  @Type(() => Number)
  @IsInt()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];
}
