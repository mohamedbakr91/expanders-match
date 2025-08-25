import { ConfigService } from "@nestjs/config";
import { AppDataSource } from "./typeorm-cli.config";
import { AccountsAndClientSeeder } from "./seeders/accounts-clients-projects.seeders";
import { ClientsService } from "src/client/client.service";
import { AccountService } from "src/accounts/accounts.service";
import { Account } from "src/accounts/entities/account.entity";
import { Client } from "src/client/entities/client.entity";
import { ProjectsService } from "src/project/project.service";
import { Project } from "src/project/entities/project.entity";
import { seedVendors } from "./seeders/vendor.seeders";
import { VendorsService } from "src/vendor/vendor.service";
import { EmailService } from "src/email/email.service";
import { Vendor } from "src/vendor/entities/vendor.entity";
import { MatchesService } from "src/matches/matches.service";
import { Match } from "src/matches/entities/match.entity";
import { DataSource } from "typeorm";

async function runSeeders() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected.");

    const configService = new ConfigService();

    const accountRepo = AppDataSource.getRepository(Account);
    const clientRepo = AppDataSource.getRepository(Client);
    const projectRepo = AppDataSource.getRepository(Project);

    const accountService = new AccountService(accountRepo);
    const clientService = new ClientsService(clientRepo, accountService);
    const vendorsRepo = AppDataSource.getRepository(Vendor);
    const vendorsService = new VendorsService(vendorsRepo);
    const matchRepo = AppDataSource.getRepository(Match);
    const matchService = new MatchesService(matchRepo);
    const emailService = new EmailService();
    const dataSource = AppDataSource;
    const projectService = new ProjectsService(
      projectRepo,
      vendorsService,
      matchService,
      clientService,
      dataSource,
      emailService,
    );

    const seeder = new AccountsAndClientSeeder(AppDataSource, clientService, accountService);
    await seeder.run();

    await seedVendors(AppDataSource);
    console.log("All seeders executed successfully!");
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log("Database connection closed.");
  }
}

runSeeders();
