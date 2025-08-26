import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, FilterQuery } from "mongoose";
import { CreateResearchDocumentDto } from "./dto/create-research-document.dto";
import { ResearchDocument } from "./entities/research-document.schema";
import { ProjectsService } from "src/project/project.service";
import { SearchResearchDocumentDto } from "./dto/research-document.dto";
import * as XLSX from "xlsx";
import axios from "axios";
import { UploadExcelDto } from "./dto/upload-file.dto";

@Injectable()
export class ResearchDocumentService {
  constructor(
    @InjectModel(ResearchDocument.name)
    private readonly researchModel: Model<ResearchDocument>,
    private readonly protectService: ProjectsService,
  ) {}

  async create(dto: CreateResearchDocumentDto) {
    await this.protectService.findOne(dto.projectId);

    const doc = await this.researchModel.create(dto);
    return doc.toObject();
  }

  async search(query: SearchResearchDocumentDto) {
    const { tag, text, projectId } = query;
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ResearchDocument> = {};
    if (projectId !== undefined) filter.projectId = projectId;
    if (tag) {
      filter.tags = { $elemMatch: { $regex: tag, $options: "i" } };
    }
    if (text) filter.$text = { $search: text };

    const [items, total] = await Promise.all([
      this.researchModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.researchModel.countDocuments(filter),
    ]);

    return {
      page,
      limit,
      total,
      items,
    };
  }

  async countByProjectIds(projectIds: number[]) {
    if (!projectIds.length) return 0;
    return this.researchModel.countDocuments({ projectId: { $in: projectIds } });
  }

  private async processExcelFile(fileUrl: string) {
    try {
      const response = await axios.get<ArrayBuffer>(fileUrl, { responseType: "arraybuffer" });
      const workbook = XLSX.read(response.data, { type: "buffer", cellDates: true, cellNF: false, cellText: false });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      return rows;
    } catch (error) {
      throw new BadRequestException("error during uploadFile");
    }
  }

  async uploadFromExcel(body: UploadExcelDto) {
    const { fileUrl } = body;
    const rows = await this.processExcelFile(fileUrl);

    const docs = await this.researchModel.insertMany(
      rows.map((r: any) => ({
        title: r.title,
        content: r.content,
        tags: r.tags ? r.tags.split(",").map((t: string) => t.trim()) : [],
        projectId: Number(r.projectId),
      })),
    );

    return docs;
  }
}
