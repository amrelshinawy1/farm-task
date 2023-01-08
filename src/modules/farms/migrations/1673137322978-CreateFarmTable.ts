import { MigrationInterface, QueryRunner } from "typeorm";

export class createFarmTable1673137322978 implements MigrationInterface {
    name = "createFarmTable1673137322978"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "farm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "size" numeric(12,2) NOT NULL DEFAULT '0', "yield" numeric(12,2) NOT NULL DEFAULT '0', "address" text, "coordinates" geometry(Point,4326), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "farm"`);
    }

}
