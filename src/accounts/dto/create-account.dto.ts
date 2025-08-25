import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { AccountRole } from "../entities/account.entity";

export class CreateAccountDto {
  @ApiProperty({
    example: "expandsUser",
    description: "Unique userName (used as username)",
  })
  @IsEmail()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    example: "StrongPass123",
    description: "Password for the account",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: AccountRole,
    example: AccountRole.CLIENT,
    description: "Role of the account (admin or client)",
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountRole)
  role?: AccountRole = AccountRole.CLIENT;
}
