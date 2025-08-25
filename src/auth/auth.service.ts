import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AccountService } from "src/accounts/accounts.service";
import { AccountTokenPayload } from "./dto/token-payload";
import { AuthHelper } from "./auth-helper.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly authHelper: AuthHelper,
  ) {}

  async login(loginDto: LoginDto) {
    const account = await this.accountService.findByUserName(loginDto.userName);
    if (!account) throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid = await this.authHelper.compareEncryptedString(loginDto.password, account.password);
    if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");

    const payload: AccountTokenPayload = {
      accountId: account.id,
      userName: account.userName,
      role: account.role,
    };

    const accessToken = await this.authHelper.generateAuthJWTToken(payload);
    return { accessToken };
  }

  async verifyToken(token: string): Promise<AccountTokenPayload> {
    return this.authHelper.verifyAuthJWTToken(token);
  }
}
