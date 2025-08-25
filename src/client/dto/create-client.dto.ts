// src/clients/dto/create-client.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNumber } from "class-validator";

export class CreateClientDto {
  @ApiProperty({ example: "Acme Corp" })
  @IsString()
  companyName: string;

  @ApiProperty({ example: "contact@acme.com" })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ example: 2, description: "Account ID associated with client" })
  @IsNumber()
  accountId: number;
}
