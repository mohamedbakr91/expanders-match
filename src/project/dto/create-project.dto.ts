// src/projects/dto/create-project.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber, IsArray, IsEnum, IsOptional } from "class-validator";
import { ProjectStatus } from "../entities/project.entity";

export class CreateProjectDto {
  @ApiProperty({ example: 1, description: "ID of the client" })
  clientId: number;

  @ApiProperty({ example: "USA", description: "Country of the project" })
  country: string;

  @ApiProperty({ example: ["IT", "Marketing"], description: "Required services" })
  @IsArray()
  @IsString({ each: true })
  servicesNeeded: string[];

  @ApiProperty({ example: 50000, description: "Budget of the project" })
  budget: number;

  @ApiPropertyOptional({ enum: ProjectStatus, example: ProjectStatus.ACTIVE })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
