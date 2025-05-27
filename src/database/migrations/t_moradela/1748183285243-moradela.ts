import { MigrationInterface, QueryRunner } from "typeorm";

export class Moradela1748183285243 implements MigrationInterface {
    name = 'Moradela1748183285243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."users" RENAME COLUMN "passwordHash" TO "password_hash"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."users" RENAME COLUMN "password_hash" TO "passwordHash"`);
    }

}
