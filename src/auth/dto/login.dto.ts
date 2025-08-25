import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "client1",
    description: "UserName used to log in",
  })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    example: "123456",
    description: "Password of the account",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
