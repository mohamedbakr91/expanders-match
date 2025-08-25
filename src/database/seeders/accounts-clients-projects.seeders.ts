import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { ClientsService } from "src/client/client.service";
import { AccountService } from "src/accounts/accounts.service";
import { AccountRole } from "src/accounts/entities/account.entity";
import { Project, ProjectStatus } from "src/project/entities/project.entity";

export class AccountsAndClientSeeder {
  constructor(
    private readonly dataSource: DataSource,
    private readonly clientService: ClientsService,
    private readonly accountService: AccountService,
  ) {}

  async run() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const adminUserNameAccount = process.env.FIRST_ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const clientsPassword = process.env.CLIENT_PASSWORD;
    const clientsEmail = process.env.CliENTS_EMAIL;

    // Clients
    const clients = [
      { username: "client1", password: clientsPassword, company: "Company 1", email: clientsEmail },
      { username: "client2", password: clientsPassword, company: "Company 2", email: clientsEmail },
      { username: "client3", password: clientsPassword, company: "Company 3", email: clientsEmail },
      { username: "client4", password: clientsPassword, company: "Company 4", email: clientsEmail },
      { username: "client5", password: clientsPassword, company: "Company 5", email: clientsEmail },
    ];

    try {
      // =========================
      // Admin
      // =========================
      const adminExists = await this.accountService.findByUserName(adminUserNameAccount, queryRunner.manager);
      if (!adminExists) {
        await queryRunner.startTransaction();
        try {
          await this.accountService.create(
            { userName: String(adminUserNameAccount), password: adminPassword, role: AccountRole.ADMIN },
            queryRunner.manager,
          );
          await queryRunner.commitTransaction();
          console.log("Admin account created successfully");
        } catch (err) {
          await queryRunner.rollbackTransaction();
          throw new Error(`Failed to create Admin account: ${err.message}`);
        }
      } else {
        console.log("Admin account already exists");
      }

      // =========================
      // Clients + Projects
      // =========================
      const createdClients: { id: number; username: string }[] = [];

      for (const clientData of clients) {
        let clientAccount = await this.accountService.findByUserName(clientData.username, queryRunner.manager);
        let clientEntity;

        if (!clientAccount) {
          await queryRunner.startTransaction();
          try {
            clientAccount = await this.accountService.create(
              { userName: clientData.username, password: clientData.password, role: AccountRole.CLIENT },
              queryRunner.manager,
            );

            clientEntity = await this.clientService.create(
              { accountId: clientAccount.id, companyName: clientData.company, contactEmail: clientData.email },
              queryRunner.manager,
            );

            await queryRunner.commitTransaction();
            console.log(`Client account "${clientData.username}" and "${clientData.company}" created successfully`);
          } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to create Client account or Company: ${err.message}`);
          }
        } else {
          clientEntity = await this.clientService.findByAccountId(clientAccount.id, queryRunner.manager);
          console.log(`Client account "${clientData.username}" already exists`);
        }

        if (clientEntity) {
          createdClients.push({ id: clientEntity.id, username: clientData.username });
        }
      }

      // =========================
      // Projects (5 projects)
      // =========================
      const projects = [
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

      for (const project of projects) {
        const projectRepo = queryRunner.manager.getRepository(Project);

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
      }
    } catch (error) {
      console.error("Seeding error:", error);
    } finally {
      await queryRunner.release();
    }
  }
}
