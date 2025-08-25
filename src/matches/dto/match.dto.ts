import { ApiProperty } from "@nestjs/swagger";

export class MatchDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  vendorId: number;

  @ApiProperty()
  score: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
