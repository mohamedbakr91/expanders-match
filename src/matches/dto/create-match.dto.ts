import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive } from "class-validator";

export class CreateMatchDto {
  @ApiProperty({ example: 1, description: "Project ID" })
  @IsNumber()
  @IsPositive()
  projectId: number;

  @ApiProperty({ example: 2, description: "Vendor ID" })
  @IsNumber()
  @IsPositive()
  vendorId: number;

  @ApiProperty({ example: 87.5, description: "Match score (0-100)" })
  @IsNumber()
  score: number;
}
