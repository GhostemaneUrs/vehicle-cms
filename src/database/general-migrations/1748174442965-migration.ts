import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748174442965 implements MigrationInterface {
    name = 'Migration1748174442965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenancy" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_53823ab6f0fc6def2626c983f0b" UNIQUE ("name"), CONSTRAINT "PK_c98009ac41a45bd29d8a56431ce" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenancy"`);
    }

}
