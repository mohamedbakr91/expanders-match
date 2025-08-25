import { Module } from "@nestjs/common";
import { MatchesService } from "./matches.service";
import { MATCHES } from "class-validator";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "./entities/match.entity";

@Module({
  // controllers: [MatchesController],
  imports: [TypeOrmModule.forFeature([Match])],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
