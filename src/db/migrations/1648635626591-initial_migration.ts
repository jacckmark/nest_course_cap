import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1648635626591 implements MigrationInterface {
    name = 'initialMigration1648635626591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "photo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "photo"`);
    }

}
