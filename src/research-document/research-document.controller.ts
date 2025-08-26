import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { ResearchDocumentService } from "./research-document.service";
import { SearchResearchDocumentDto } from "./dto/research-document.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
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
  @ApiOperation({
    summary: "🔍 Search research documents (Admin only)",
    description: "Search by tag (partial match) or text (full-text search). Both fields are optional.",
  })
  @ApiResponse({
    status: 200,
    description: "List of research documents matching the search criteria",
    schema: {
      example: {
        page: 1,
        limit: 20,
        total: 2,
        items: [
          {
            _id: "68adf8167b3b3d9778edc3c8",
            projectId: 3,
            title: "Data,ETL,Cleaning",
            content: "Handling missing values, etc.",
            tags: ["Data Cleaning Tips"],
            __v: 0,
            createdAt: "2025-08-26T18:08:22.994Z",
            updatedAt: "2025-08-26T18:08:22.994Z",
          },
          {
            _id: "68adf4c9b42c4eea8358fb3d",
            projectId: 3,
            title: "Data,ETL,Cleaning",
            content: "Handling missing values, etc.",
            tags: ["Data Cleaning Tips"],
            __v: 0,
            createdAt: "2025-08-26T17:54:17.177Z",
            updatedAt: "2025-08-26T17:54:17.177Z",
          },
        ],
      },
    },
  })
  @Roles(AccountRole.ADMIN)
  async search(@Query() query: SearchResearchDocumentDto) {
    return this.service.search(query);
  }

  @ApiOperation({
    summary: "📤 Upload research documents from Excel (Admin only)",
    description: "Upload research documents in bulk from an Excel file.",
  })
  @ApiResponse({
    example: [
      {
        projectId: 1,
        title: "Machine Learning Intro",
        content: "Basics of ML and algorithms",
        tags: ["AI", "ML", "Data Science"],
        _id: "68adf8167b3b3d9778edc3c6",
        __v: 0,
        createdAt: "2025-08-26T18:08:22.992Z",
        updatedAt: "2025-08-26T18:08:22.992Z",
      },
      {
        projectId: 2,
        title: "AI,DL,Neural Nets",
        content: "CNNs, RNNs and Transformers",
        tags: ["Deep Learning Guide"],
        _id: "68adf8167b3b3d9778edc3c7",
        __v: 0,
        createdAt: "2025-08-26T18:08:22.994Z",
        updatedAt: "2025-08-26T18:08:22.994Z",
      },
    ],
  })
  @Post("upload-excel")
  async uploadExcel(@Body() body: UploadExcelDto) {
    return this.service.uploadFromExcel(body);
  }
}
