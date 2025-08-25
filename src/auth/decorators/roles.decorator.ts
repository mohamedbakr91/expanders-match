import { SetMetadata } from "@nestjs/common";
import { AccountRole } from "src/accounts/entities/account.entity";

export const ROLES_KEY = "roles";

export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles);
