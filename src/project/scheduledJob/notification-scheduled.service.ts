import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ProjectsService } from "../project.service";
import { MatchesService } from "src/matches/matches.service";
import { VendorsService } from "src/vendor/vendor.service";
import { ProjectStatus } from "../entities/project.entity";

@Injectable()
export class MatchScheduler {
  private readonly logger = new Logger(MatchScheduler.name);

  constructor(
    private readonly projectService: ProjectsService,
    private readonly matchService: MatchesService,
    private readonly vendorService: VendorsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshDailyMatches() {
    this.logger.log("Refreshing daily matches for active projects...");

    const activeProjects = await this.projectService.getProjectsIdsByStatus(ProjectStatus.ACTIVE);

    for (const projectId of activeProjects) {
      await this.projectService.rebuildMatches(projectId);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async flagVendorsWithExpiredSLAs() {
    this.logger.log("Flagging vendors with expired SLAs...");
    await this.vendorService.flagExpiredSLAs();
  }
}
