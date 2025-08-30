import { DataSource, EntityManager } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { ClientsService } from "src/client/client.service";
import { AccountService } from "src/accounts/accounts.service";
import { AccountRole } from "src/accounts/entities/account.entity";
import { Project, ProjectStatus } from "src/project/entities/project.entity";

export abstract class BaseSeeder {
  constructor(protected readonly dataSource: DataSource) {}

  protected async withTransaction<T>(operation: (entityManager: EntityManager) => Promise<T>): Promise<T | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await operation(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

export class AccountsAndClientSeeder extends BaseSeeder {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly clientService: ClientsService,
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
  ) {
    super(dataSource);
  }

  private readonly clientsData = [
    { username: "client1", company: "Company 1", email: this.configService.get("CliENTS_EMAIL") },
    { username: "client2", company: "Company 2", email: this.configService.get("CliENTS_EMAIL") },
    { username: "client3", company: "Company 3", email: this.configService.get("CliENTS_EMAIL") },
    { username: "client4", company: "Company 4", email: this.configService.get("CliENTS_EMAIL") },
    { username: "client5", company: "Company 5", email: this.configService.get("CliENTS_EMAIL") },
  ];

  private readonly projectsData = [
    {
      clientIndex: 0,
      country: "Egypt",
      servicesNeeded: ["legal", "tax"],
      budget: 50000,
      status: ProjectStatus.ACTIVE,
    },
    {
      clientIndex: 1,
      country: "UAE",
      servicesNeeded: ["logistics", "import"],
      budget: 75000,
      status: ProjectStatus.ACTIVE,
    },
    {
      clientIndex: 2,
      country: "KSA",
      servicesNeeded: ["finance", "compliance"],
      budget: 60000,
      status: ProjectStatus.ACTIVE,
    },
    {
      clientIndex: 3,
      country: "Morocco",
      servicesNeeded: ["hr", "recruitment"],
      budget: 40000,
      status: ProjectStatus.ACTIVE,
    },
    {
      clientIndex: 4,
      country: "Jordan",
      servicesNeeded: ["market_research", "strategy"],
      budget: 55000,
      status: ProjectStatus.ACTIVE,
    },
  ];

  async run() {
    const adminUserNameAccount = this.configService.get("FIRST_ADMIN_USERNAME");
    const adminPassword = this.configService.get("ADMIN_PASSWORD");
    const clientsPassword = this.configService.get("CLIENT_PASSWORD");

    // =========================
    // Admin
    // =========================
    const adminExists = await this.accountService.findByUserName(adminUserNameAccount);
    if (!adminExists) {
      try {
        await this.withTransaction(async entityManager => {
          await this.accountService.create(
            { userName: String(adminUserNameAccount), password: adminPassword, role: AccountRole.ADMIN },
            entityManager,
          );
        });
        console.log("Admin account created successfully");
      } catch (err) {
        throw new Error(`Failed to create Admin account: ${err.message}`);
      }
    } else {
      console.log("Admin account already exists");
    }

    // =========================
    // Clients + Projects
    // =========================
    const createdClients: { id: number; username: string }[] = [];

    for (const clientData of this.clientsData) {
      let clientAccount = await this.accountService.findByUserName(clientData.username);
      let clientEntity;

      if (!clientAccount) {
        try {
          const result = await this.withTransaction(async entityManager => {
            const newClientAccount = await this.accountService.create(
              { userName: clientData.username, password: clientsPassword, role: AccountRole.CLIENT },
              entityManager,
            );

            const newClientEntity = await this.clientService.create(
              { accountId: newClientAccount.id, companyName: clientData.company, contactEmail: clientData.email },
              entityManager,
            );
            return { newClientAccount, newClientEntity };
          });
          clientAccount = result.newClientAccount;
          clientEntity = result.newClientEntity;

          console.log(`Client account "${clientData.username}" and "${clientData.company}" created successfully`);
        } catch (err) {
          throw new Error(`Failed to create Client account or Company: ${err.message}`);
        }
      } else {
        clientEntity = await this.clientService.findByAccountId(clientAccount.id);
        console.log(`Client account "${clientData.username}" already exists`);
      }

      if (clientEntity) {
        createdClients.push({ id: clientEntity.id, username: clientData.username });
      }
    }

    // =========================
    // Projects (5 projects)
    // =========================
    for (const project of this.projectsData) {
      await this.withTransaction(async entityManager => {
        const projectRepo = entityManager.getRepository(Project);

        const exists = await projectRepo.findOne({
          where: {
            clientId: createdClients[project.clientIndex].id,
            country: project.country,
          },
        });

        if (!exists) {
          const newProject = projectRepo.create({
            clientId: createdClients[project.clientIndex].id,
            country: project.country,
            servicesNeeded: project.servicesNeeded,
            budget: project.budget,
            status: project.status,
          });

          await projectRepo.save(newProject);
          console.log(`Project for client ${createdClients[project.clientIndex].username} created successfully`);
        } else {
          console.log(
            `Project for client ${createdClients[project.clientIndex].username} in ${project.country} already exists`,
          );
        }
      });
    }
  }
}
