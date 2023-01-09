import { MigrationInterface, QueryRunner } from "typeorm";

export class farmUserRelation1673154223230 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "FK_farm_userid_user_id" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_farm_userid_user_id"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "userId"`);
    }

}
