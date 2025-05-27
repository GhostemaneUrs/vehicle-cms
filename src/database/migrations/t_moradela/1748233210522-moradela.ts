import { MigrationInterface, QueryRunner } from "typeorm";

export class Moradela1748233210522 implements MigrationInterface {
    name = 'Moradela1748233210522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."users" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."users" DROP COLUMN "is_active"`);
    }

}
