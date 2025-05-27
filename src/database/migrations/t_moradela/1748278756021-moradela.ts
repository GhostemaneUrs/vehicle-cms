import { MigrationInterface, QueryRunner } from "typeorm";

export class Moradela1748278756021 implements MigrationInterface {
    name = 'Moradela1748278756021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "FK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_0cb93c5877d37e954e2aa59e52"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_d422dabc78ff74a8dab6583da0"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "PK_7931614007a93423204b4b73240"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "PK_d422dabc78ff74a8dab6583da02" PRIMARY KEY ("permissionsId")`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP COLUMN "rolesId"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "PK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP COLUMN "permissionsId"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD "role_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "PK_178199805b901ccd220ab7740ec" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD "permission_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "PK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "t_moradela"."role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "t_moradela"."role_permissions" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "t_moradela"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "t_moradela"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "PK_25d24010f53bb80b78e412c9656"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "PK_178199805b901ccd220ab7740ec" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP COLUMN "permission_id"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "PK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD "permissionsId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "PK_d422dabc78ff74a8dab6583da02" PRIMARY KEY ("permissionsId")`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD "rolesId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "PK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "PK_7931614007a93423204b4b73240" PRIMARY KEY ("rolesId", "permissionsId")`);
        await queryRunner.query(`CREATE INDEX "IDX_d422dabc78ff74a8dab6583da0" ON "t_moradela"."role_permissions" ("permissionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0cb93c5877d37e954e2aa59e52" ON "t_moradela"."role_permissions" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "FK_d422dabc78ff74a8dab6583da02" FOREIGN KEY ("permissionsId") REFERENCES "t_moradela"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c" FOREIGN KEY ("rolesId") REFERENCES "t_moradela"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
