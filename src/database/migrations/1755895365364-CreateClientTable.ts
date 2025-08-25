import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateClientsTable1755895365364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "clients",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "companyName",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "contactEmail",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "accountId",
            type: "int",
            isNullable: false,
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
      "clients",
      new TableForeignKey({
        columnNames: ["accountId"],
        referencedColumnNames: ["id"],
        referencedTableName: "accounts",
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("clients");
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("accountId") !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey("clients", foreignKey);
    }

    await queryRunner.dropTable("clients");
  }
}
