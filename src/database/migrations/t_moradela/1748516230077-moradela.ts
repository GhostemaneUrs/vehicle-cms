import { MigrationInterface, QueryRunner } from "typeorm";

export class Moradela1748516230077 implements MigrationInterface {
    name = 'Moradela1748516230077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" DROP CONSTRAINT "FK_3f3814699e41cfc602b42537c4b"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" DROP CONSTRAINT "FK_86ef6061f6f13aa9252b12cbe87"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" DROP CONSTRAINT "FK_4c6aaf014ba0d66a74bb5522726"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" RENAME COLUMN "projectId" TO "project_id"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" ADD CONSTRAINT "FK_6b2cdc9f697f0c0721c474a67de" FOREIGN KEY ("project_id") REFERENCES "t_moradela"."projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" ADD CONSTRAINT "FK_86ef6061f6f13aa9252b12cbe87" FOREIGN KEY ("user_id") REFERENCES "t_moradela"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" ADD CONSTRAINT "FK_4c6aaf014ba0d66a74bb5522726" FOREIGN KEY ("project_id") REFERENCES "t_moradela"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" DROP CONSTRAINT "FK_4c6aaf014ba0d66a74bb5522726"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" DROP CONSTRAINT "FK_86ef6061f6f13aa9252b12cbe87"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" DROP CONSTRAINT "FK_6b2cdc9f697f0c0721c474a67de"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" RENAME COLUMN "project_id" TO "projectId"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" ADD CONSTRAINT "FK_4c6aaf014ba0d66a74bb5522726" FOREIGN KEY ("project_id") REFERENCES "t_moradela"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" ADD CONSTRAINT "FK_86ef6061f6f13aa9252b12cbe87" FOREIGN KEY ("user_id") REFERENCES "t_moradela"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" ADD CONSTRAINT "FK_3f3814699e41cfc602b42537c4b" FOREIGN KEY ("projectId") REFERENCES "t_moradela"."projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
