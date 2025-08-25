import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TopThreeVendorsDto {
  @ApiPropertyOptional({
    description: "Filter by country (if empty, returns all countries)",
    example: "Egypt",
  })
  @IsNotEmpty()
  @IsString()
  country: string;
}
