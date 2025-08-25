import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class SendEmailDto {
  @ApiProperty({ example: "Welcome Email", maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  subject: string;
  @ApiProperty({
    example: "Welcome to our service. Thanks for joining us.",
    description: "The plain text content of the email (no HTML formatting).",
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({
    example: "<h1>Welcome</h1><p>Thanks for joining us.</p>",
    description: "Email body supports HTML or plain text",
  })
  @IsString()
  @IsOptional()
  body: string;

  @ApiProperty({ example: "mohammed.bakr131@gmail.com", description: "Email body supports HTML or plain text" })
  @IsString()
  @IsEmail()
  to: string;
}
