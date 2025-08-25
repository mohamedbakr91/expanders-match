import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new UnauthorizedException("No token provided");

    const [, token] = authHeader.split(" ");
    if (!token) throw new UnauthorizedException("Invalid token");

    const payload = await this.authService.verifyToken(token);
    req["user"] = payload;
    return true;
  }
}
