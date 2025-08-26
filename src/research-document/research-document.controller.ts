import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { ResearchDocumentService } from "./research-document.service";
import { SearchResearchDocumentDto } from "./dto/research-document.dto";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/gaurd/gwtAuthgaurd";
import { RolesGuard } from "src/auth/gaurd/role-gaurd";
import { Roles } from "src/auth/decorators/roles.decorator";
import { AccountRole } from "src/accounts/entities/account.entity";
import { UploadExcelDto } from "./dto/upload-file.dto";

@Controller("research-document")
@ApiBearerAuth("JWT")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResearchDocumentController {
  constructor(private readonly service: ResearchDocumentService) {}
  @Get("search")
  @ApiOperation({ summary: "🔍 Search research documents (Admin only)" })
  @Roles(AccountRole.ADMIN)
  async search(@Query() query: SearchResearchDocumentDto) {
    return this.service.search(query);
  }

  @ApiOperation({ summary: "📤 Upload research documents from Excel (Admin only)" })
  @Post("upload-excel")
  async uploadExcel(@Body() body: UploadExcelDto) {
    return this.service.uploadFromExcel(body);
  }
}
