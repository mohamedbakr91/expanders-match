import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ResearchDocument, ResearchDocumentSchema } from "./entities/research-document.schema";
import { ResearchDocumentService } from "./research-document.service";
import { ProjectModule } from "src/project/project.module";
import { ResearchDocumentController } from "./research-document.controller";
import { AuthModule } from "src/auth/auth.module";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: ResearchDocument.name, schema: ResearchDocumentSchema }]),
    forwardRef(() => ProjectModule),
    AuthModule,
  ],
  controllers: [ResearchDocumentController],
  providers: [ResearchDocumentService],
  exports: [ResearchDocumentService],
})
export class ResearchDocumentModule {}
