import { forwardRef, Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectsService } from "./project.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./entities/project.entity";
import { AccountsModule } from "src/accounts/accounts.module";
import { VendorModule } from "src/vendor/vendor.module";
import { ClientsModule } from "src/client/client.module";
import { MatchesModule } from "src/matches/matches.module";
import { EmailService } from "src/email/email.service";
import { AuthModule } from "src/auth/auth.module";
import { AnalyticsService } from "./analytic.service";
import { AnalyticController } from "./analytic.controller";
import { ResearchDocumentModule } from "src/research-document/research-document.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    AuthModule,
    AccountsModule,
    VendorModule,
    ClientsModule,
    MatchesModule,
    forwardRef(() => ResearchDocumentModule),
  ],

  controllers: [ProjectController, AnalyticController],
  providers: [ProjectsService, EmailService, AnalyticsService],
  exports: [ProjectsService],
})
export class ProjectModule {}
