// src/research/schemas/research-document.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ResearchDocumentDocument = HydratedDocument<ResearchDocument>;

@Schema({ timestamps: true })
export class ResearchDocument {
  @Prop({ required: true, index: true })
  projectId: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  content?: string;

  @Prop()
  url?: string;

  @Prop({ type: [String], index: true })
  tags: string[];
}

export const ResearchDocumentSchema = SchemaFactory.createForClass(ResearchDocument);

ResearchDocumentSchema.index({ title: "text", content: "text" });
