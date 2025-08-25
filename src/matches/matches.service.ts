import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Match } from "./entities/match.entity";
import { CreateMatchDto } from "./dto/create-match.dto";
import { UpdateMatchDto } from "./dto/update-match.dto";
import { MatchDto } from "./dto/match.dto";

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
  ) {}

  async create(dto: CreateMatchDto, transaction: EntityManager): Promise<MatchDto> {
    this.logger.log(`Creating match projectId=${dto.projectId}, vendorId=${dto.vendorId}, score=${dto.score}`);

    try {
      const match = transaction.create(Match, dto);
      const savedMatch = await transaction.save(match);

      this.logger.log(`Match created with ID: ${savedMatch.id}`);
      return savedMatch;
    } catch (error) {
      this.logger.error(`Failed to create match: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<MatchDto[]> {
    this.logger.log(`Fetching all matches`);
    return this.matchRepo.find({
      relations: ["project", "vendor"],
    });
  }

  async findOne(id: number, transaction?: EntityManager): Promise<MatchDto> {
    this.logger.log(`Fetching match with ID: ${id}`);

    const repo = transaction ? transaction.getRepository(Match) : this.matchRepo;

    const match = await repo.findOne({
      where: { id },
      relations: ["project", "vendor"],
    });

    if (!match) {
      this.logger.warn(`Match with ID ${id} not found`);
      throw new NotFoundException("Match not found");
    }

    return match;
  }

  async update(id: number, dto: UpdateMatchDto): Promise<MatchDto> {
    this.logger.log(`Updating match with ID: ${id}`);

    const match = await this.findOne(id);

    Object.assign(match, dto);

    const updatedMatch = await this.matchRepo.save(match);
    this.logger.log(`Match with ID ${id} updated`);

    return updatedMatch;
  }

  async getTopVendorsSince(date: Date, country?: string) {
    const query = this.matchRepo
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.vendor", "vendor")
      .leftJoinAndSelect("match.project", "project")
      .select("project.country", "country")
      .addSelect("vendor.id", "vendorId")
      .addSelect("vendor.name", "vendorName")
      .addSelect("AVG(match.score)", "avgScore")
      .where("match.createdAt >= :date", { date })
      .groupBy("project.country")
      .addGroupBy("vendor.id")
      .addGroupBy("vendor.name")
      .orderBy("avgScore", "DESC");

    if (country) {
      query.andWhere("project.country = :country", { country });
    }

    return await query.getRawMany();
  }

  async removeByProjectId(projectId: number, manager?: EntityManager): Promise<void> {
    this.logger.log(`Removing matches for project ID: ${projectId}`);

    const repo = manager ? manager.getRepository(Match) : this.matchRepo;

    const matches = await repo.find({ where: { projectId } });

    if (!matches.length) {
      this.logger.warn(`No matches found for project ID ${projectId}`);
      return;
    }

    await repo.remove(matches);

    this.logger.log(`Removed ${matches.length} matches for project ID ${projectId}`);
  }
}
