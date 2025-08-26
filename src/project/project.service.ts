import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { Repository, EntityManager, DataSource } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Project, ProjectStatus } from "./entities/project.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { VendorsService } from "src/vendor/vendor.service";
import { ClientsService } from "src/client/client.service";
import { Vendor } from "src/vendor/entities/vendor.entity";
import { MatchesService } from "src/matches/matches.service";
import { EmailService } from "src/email/email.service";
import { MatchDto } from "src/matches/dto/match.dto";

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly vendorService: VendorsService,
    private readonly matchService: MatchesService,
    private readonly clientService: ClientsService,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {}

  async rebuildMatches(projectId: number, accountId?: number): Promise<MatchDto[]> {
    this.logger.log(`Rebuilding matches for project ${projectId}, client ${accountId}`);

    const project = await this.findOne(projectId);
    if (!project) {
      this.logger.warn(`Project ${projectId} not found`);
      throw new NotFoundException("Project not found");
    }
    let client;
    if (accountId) {
      client = await this.clientService.findByAccountId(accountId);
    }
    await this.matchService.removeByProjectId(projectId);
    const vendors = await this.vendorService.findByCountryAndServices({
      country: project.country,
      servicesNeeded: project.servicesNeeded,
    });

    if (!vendors.length) {
      this.logger.log(`No vendors matched for project ${projectId}`);
      throw new NotFoundException("no vendors found");
    }

    return this.dataSource.transaction(async manager => {
      const matches = await Promise.all(
        vendors.map(async vendor => {
          const score = this.calculateScore(vendor, project);

          const match = await this.matchService.create(
            {
              projectId: project.id,
              vendorId: vendor.id,
              score,
            },
            manager,
          );

          return match;
        }),
      );

      await this.emailService.sendEmail({
        to: client.contactEmail,
        subject: `Matches Rebuilt for Project ${project.id}`,
        text: `Dear ${client.companyName},\n\nWe have rebuilt matches for your project "${project.country}".\nTotal matches: ${matches.length}\n\nThank you,\nExpanders360 Team`,
        body: `<p>Dear <b>${client.companyName}</b>,</p>
           <p>We have rebuilt matches for your project in <b>${project.country}</b>.</p>
           <p><b>Total matches:</b> ${matches.length}</p>
           <p>Thank you,<br/>Expanders360 Team</p>`,
      });

      return matches;
    });
  }

  async create(createProjectDto: Partial<CreateProjectDto>, manager?: EntityManager): Promise<Project> {
    this.logger.log(`Creating project for clientId: ${createProjectDto.clientId}`);

    const repo = manager ? manager.getRepository(Project) : this.projectRepo;

    const project = repo.create({
      clientId: createProjectDto.clientId,
      country: createProjectDto.country,
      servicesNeeded: createProjectDto.servicesNeeded,
      budget: createProjectDto.budget,
      status: createProjectDto.status,
    });

    const savedProject = await repo.save(project);
    this.logger.log(`Project created with ID: ${savedProject.id}`);
    return savedProject;
  }

  async findByClientId(clientId: number, manager?: EntityManager): Promise<Project[]> {
    this.logger.log(`Fetching projects for clientId: ${clientId}`);

    const repo = manager ? manager.getRepository(Project) : this.projectRepo;

    return repo.find({ where: { clientId } });
  }
  async getProjectIdsByCountry(country: string): Promise<number[]> {
    const projects = await this.projectRepo.find({
      where: { country },
      select: ["id"],
    });
    return projects.map(p => p.id);
  }

  async getProjectsIdsByStatus(status: ProjectStatus): Promise<number[]> {
    const projects = await this.projectRepo.find({
      where: { status },
      select: ["id"],
    });
    return projects.map(p => p.id);
  }

  async findOne(id: number): Promise<Project> {
    this.logger.log(`Fetching project with ID: ${id}`);
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) {
      this.logger.warn(`Project with ID ${id} not found`);
      throw new NotFoundException("Project not found");
    }
    return project;
  }

  async remove(id: number, manager?: EntityManager): Promise<void> {
    this.logger.log(`Removing project with ID: ${id}`);
    const repo = manager ? manager.getRepository(Project) : this.projectRepo;
    const project = await this.findOne(id);
    await repo.remove(project);
    this.logger.log(`Project with ID ${id} removed`);
  }

  private calculateScore(vendor: Vendor, project: Project): number {
    const overlap = project.servicesNeeded.filter(s => vendor.servicesOffered.includes(s));
    const slaWeight = vendor.responseSlaHours;

    const rawScore = Number(overlap.length * 2 + Number(vendor.rating) + slaWeight);

    return parseFloat(rawScore.toFixed(2));
  }
}
