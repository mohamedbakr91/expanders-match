import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateMatchDto } from "./create-match.dto";
import { IsNumber, Max, Min } from "class-validator";

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @ApiProperty({ example: 92.3, description: "Updated score (0-100)", required: false })
  @IsNumber()
  @Min(0)
  score?: number;
}
