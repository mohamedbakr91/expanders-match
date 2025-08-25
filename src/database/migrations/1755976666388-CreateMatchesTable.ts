import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMatchesTable1755976666388 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "matches",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "projectId",
            type: "int",
            isNullable: false,
          },
          {
            name: "vendorId",
            type: "int",
            isNullable: false,
          },
          {
            name: "score",
            type: "decimal",
            precision: 5,
            scale: 2,
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

    await queryRunner.createForeignKeys("matches", [
      new TableForeignKey({
        columnNames: ["projectId"],
        referencedColumnNames: ["id"],
        referencedTableName: "projects",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["vendorId"],
        referencedColumnNames: ["id"],
        referencedTableName: "vendors",
        onDelete: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("matches");
  }
}
