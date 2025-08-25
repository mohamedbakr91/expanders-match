import { IsString, IsArray, IsOptional, IsNumber } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateVendorDto {
  @ApiProperty({ example: "Acme Consulting", description: "Name of the vendor" })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: ["Egypt", "UAE"],
    description: "Countries supported by the vendor",
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((v: string) => v.toLowerCase()))
  countriesSupported?: string[];

  @ApiPropertyOptional({
    example: ["legal", "marketing"],
    description: "Services offered by the vendor",
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((v: string) => v.toLowerCase()))
  servicesOffered?: string[];

  @ApiPropertyOptional({
    example: 4.5,
    description: "Average vendor rating (0–5)",
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({
    example: 48,
    description: "Response SLA in hours",
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  responseSlaHours?: number;
}
