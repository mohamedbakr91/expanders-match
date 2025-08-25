import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthHelper } from "./auth-helper.service";
import { AccountsModule } from "src/accounts/accounts.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccountsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.jwtSecret"),
        signOptions: { expiresIn: configService.get<string | number>("jwt.tokenExpiration") },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],
  exports: [AuthService],
})
export class AuthModule {}
