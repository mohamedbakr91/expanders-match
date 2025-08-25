import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVendorsTable1755973191821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "vendors",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "countriesSupported",
            type: "text",
            isNullable: true,
          },
          {
            name: "servicesOffered",
            type: "text",
            isNullable: true,
          },
          {
            name: "rating",
            type: "decimal",
            precision: 3,
            scale: 2,
            default: 0,
          },
          {
            name: "responseSlaHours",
            type: "int",
            default: 24,
          },
          {
            name: "isSLAExpired",
            type: "boolean",
            default: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("vendors");
  }
}
