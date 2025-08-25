import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProjectsTable1755895365365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "projects",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "clientId",
            type: "int",
          },
          {
            name: "country",
            type: "varchar",
            length: "100",
          },
          {
            name: "servicesNeeded",
            type: "json",
          },
          {
            name: "budget",
            type: "decimal",
            precision: 12,
            scale: 2,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "in_progress", "completed", "cancelled", "active"],
            default: "'pending'",
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

    await queryRunner.createForeignKey(
      "projects",
      new TableForeignKey({
        columnNames: ["clientId"],
        referencedColumnNames: ["id"],
        referencedTableName: "clients",
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("projects");
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("clientId") !== -1);
    await queryRunner.dropForeignKey("projects", foreignKey);
    await queryRunner.dropTable("projects");
  }
}
