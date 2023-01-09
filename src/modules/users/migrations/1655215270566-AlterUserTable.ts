import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTable1655215270565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "coordinates" geometry(Point,4326)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "address" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coordinates"`);
  }
}
