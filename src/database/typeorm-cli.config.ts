import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";
import { Client } from "src/client/entities/client.entity";
import { Account } from "src/accounts/entities/account.entity";
import { Project } from "src/project/entities/project.entity";
import { Vendor } from "src/vendor/entities/vendor.entity";
import { Match } from "src/matches/entities/match.entity";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Account, Client, Project, Vendor, Match],
  migrations: [__dirname + "/../database/migrations/*.ts"],

  synchronize: false,
  logging: true,
});
