import { Controller, Post, Body, ValidationPipe, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth  Controller")
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: "Login" })
  @ApiBody({ type: LoginDto })
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
