import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Client } from "./entities/client.entity";
import { ClientsService } from "./client.service";
import { AccountsModule } from "src/accounts/accounts.module";

@Module({
  imports: [TypeOrmModule.forFeature([Client]), AccountsModule],
  providers: [ClientsService],
  // controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
