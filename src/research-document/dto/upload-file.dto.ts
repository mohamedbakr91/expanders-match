import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class UploadExcelDto {
  @ApiProperty({
    description: "Public URL for the Excel file",
    example: "https://example.com/research.xlsx",
  })
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;
}
