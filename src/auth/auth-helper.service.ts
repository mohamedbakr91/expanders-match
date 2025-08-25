import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { AccountTokenPayload } from "./dto/token-payload";

@Injectable()
export class AuthHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAuthJWTToken(data: AccountTokenPayload) {
    return await this.jwtService.signAsync(data, {
      secret: this.configService.get("jwt.jwtSecret"),
      expiresIn: this.configService.get("jwt.tokenExpiration"),
    });
  }
  async verifyAuthJWTToken(token: string): Promise<AccountTokenPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("jwtSecret"),
      });
      return decoded as AccountTokenPayload;
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  async encrypt(value: string): Promise<string> {
    return await hash(value, 10);
  }

  async compareEncryptedString(originalString: string, encryptedString: string): Promise<boolean> {
    return await compare(originalString, encryptedString);
  }
}
