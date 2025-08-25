import { AccountRole } from "src/accounts/entities/account.entity";

export interface AccountTokenPayload {
  accountId: number;
  userName: string;
  role?: AccountRole;
}
