import { Controller, Get, Post, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { ProjectsService } from "./project.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/decorators/currentUser";
import { AccountTokenPayload } from "src/auth/dto/token-payload";
import { MatchDto } from "src/matches/dto/match.dto";
import { JwtAuthGuard } from "src/auth/gaurd/gwtAuthgaurd";
import { Roles } from "src/auth/decorators/roles.decorator";
import { AccountRole } from "src/accounts/entities/account.entity";
import { RolesGuard } from "src/auth/gaurd/role-gaurd";
@Controller("project")
@ApiTags("Projects Controller")
@ApiBearerAuth("JWT")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post(":id/matches/rebuild")
  @Roles(AccountRole.CLIENT)
  @ApiOperation({ summary: "Rebuild matches for a project" })
  @ApiParam({ name: "id", type: Number, description: "Project ID" })
  @ApiResponse({ status: 200, description: "Matches rebuilt", type: [MatchDto] })
  async rebuildMatches(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentAccount: AccountTokenPayload,
  ): Promise<MatchDto[]> {
    console.log(currentAccount);
    return this.projectService.rebuildMatches(id, currentAccount.accountId);
  }
}
