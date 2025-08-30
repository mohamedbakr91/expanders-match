import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";
import { Client } from "src/client/entities/client.entity";
import { Account } from "src/accounts/entities/account.entity";
import { Project } from "src/project/entities/project.entity";
import { Vendor } from "src/vendor/entities/vendor.entity";
import { Match } from "src/matches/entities/match.entity";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function createDatabaseIfNotExists() {
  const adminDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
  });

  try {
    await adminDataSource.initialize();
    console.log("Connected to MySQL server");

    const databaseName = process.env.DB_NAME;
    await adminDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    console.log(`Database '${databaseName}' created or already exists`);

    await adminDataSource.destroy();

    const appDataSource = new DataSource({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: databaseName,
      entities: [Client, Account, Project, Vendor, Match],
      synchronize: false,
      logging: true,
    });

    await appDataSource.initialize();
    console.log("Connected to application database");
    await appDataSource.destroy();

    return true;
  } catch (error) {
    console.error("Error creating database:", error);
    throw error;
  }
}

if (require.main === module) {
  createDatabaseIfNotExists()
    .then(() => {
      console.log("Database setup completed successfully");
      process.exit(0);
    })
    .catch(error => {
      console.error("Database setup failed:", error);
      process.exit(1);
    });
}

export { createDatabaseIfNotExists };
