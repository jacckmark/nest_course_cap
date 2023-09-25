import {MigrationInterface, QueryRunner} from "typeorm";

export class initPhotoUserRelation1648645588600 implements MigrationInterface {
    name = 'initPhotoUserRelation1648645588600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_photo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" varchar, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_photo"("id", "filename", "description") SELECT "id", "filename", "description" FROM "photo"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`ALTER TABLE "temporary_photo" RENAME TO "photo"`);
        await queryRunner.query(`CREATE TABLE "temporary_photo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" varchar, "userId" integer, CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_photo"("id", "filename", "description", "userId") SELECT "id", "filename", "description", "userId" FROM "photo"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`ALTER TABLE "temporary_photo" RENAME TO "photo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" RENAME TO "temporary_photo"`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" varchar, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "photo"("id", "filename", "description", "userId") SELECT "id", "filename", "description", "userId" FROM "temporary_photo"`);
        await queryRunner.query(`DROP TABLE "temporary_photo"`);
        await queryRunner.query(`ALTER TABLE "photo" RENAME TO "temporary_photo"`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" varchar)`);
        await queryRunner.query(`INSERT INTO "photo"("id", "filename", "description") SELECT "id", "filename", "description" FROM "temporary_photo"`);
        await queryRunner.query(`DROP TABLE "temporary_photo"`);
    }

}
