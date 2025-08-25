// analytics.service.ts
import { Injectable } from "@nestjs/common";

import { MatchesService } from "src/matches/matches.service";

import { ProjectsService } from "./project.service";
import { ResearchDocumentService } from "src/research-document/research-document.service";
import { TopThreeVendorsDto } from "./dto/top-three-vendor.dto";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly matchService: MatchesService,

    private researchDocumentService: ResearchDocumentService,
  ) {}

  async getTopVendors(data: TopThreeVendorsDto) {
    const { country } = data;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const topVendors = await this.matchService.getTopVendorsSince(thirtyDaysAgo, country);
    const filtered = topVendors.slice(0, 3);

    const projectIds = await this.projectService.getProjectIdsByCountry(country);
    const count = await this.researchDocumentService.countByProjectIds(projectIds);

    return {
      country,
      topVendors: filtered,
      researchDocsCount: count,
    };
  }
}
