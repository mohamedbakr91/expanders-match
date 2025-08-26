import { Controller, Get, Post, Param, ParseIntPipe, HttpStatus, UseGuards, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "src/auth/gaurd/gwtAuthgaurd";
import { RolesGuard } from "src/auth/gaurd/role-gaurd";

import { AnalyticsService } from "./analytic.service";
import { AccountRole } from "src/accounts/entities/account.entity";
import { Roles } from "src/auth/decorators/roles.decorator";
import { TopThreeVendorsDto } from "./dto/top-three-vendor.dto";
@Controller("analytic")
@ApiTags("analytic Controller")
@ApiBearerAuth("JWT")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AccountRole.ADMIN)
export class AnalyticController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("top-vendors")
  @ApiOperation({ summary: "Get top 3 vendors per country and research document counts (For Admins Only)" })
  @ApiResponse({
    status: 200,
    description: "Top vendors and research docs count per country",
    schema: {
      example: [
        {
          country: "Egypt",
          topVendors: [
            { vendorId: 1, vendorName: "Acme Consulting", avgScore: 44.5 },
            { vendorId: 6, vendorName: "PrimeTax Advisors", avgScore: 24.6 },
          ],
          researchDocsCount: 12,
        },
      ],
    },
  })
  async getTopVendors(@Query() query: TopThreeVendorsDto) {
    return this.analyticsService.getTopVendors(query);
  }
}
