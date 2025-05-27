import { MigrationInterface, QueryRunner } from "typeorm";

export class Moradela1748182397440 implements MigrationInterface {
    name = 'Moradela1748182397440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "t_moradela"."organizational" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, CONSTRAINT "PK_b6c9f02eeb7ca92136f9a9e43f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_organizational_name" ON "t_moradela"."organizational" ("name") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2187088ab5ef2a918473cb99007" UNIQUE ("name"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_project_name" ON "t_moradela"."projects" ("name") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."transfers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "vehicleId" uuid, "clientId" uuid, "transmitterId" uuid, "projectId" uuid, "organizationalId" uuid, CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plate" character varying NOT NULL, "service" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ec7181ebdab798d97070122a5bf" UNIQUE ("plate"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."role_permissions" ("rolesId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_7931614007a93423204b4b73240" PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0cb93c5877d37e954e2aa59e52" ON "t_moradela"."role_permissions" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d422dabc78ff74a8dab6583da0" ON "t_moradela"."role_permissions" ("permissionsId") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."user_roles" ("usersId" uuid NOT NULL, "rolesId" uuid NOT NULL, CONSTRAINT "PK_38ffcfb865fc628fa337d9a0d4f" PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_99b019339f52c63ae615358738" ON "t_moradela"."user_roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_13380e7efec83468d73fc37938" ON "t_moradela"."user_roles" ("rolesId") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."user_projects" ("usersId" uuid NOT NULL, "projectsId" uuid NOT NULL, CONSTRAINT "PK_f3563c643f9fc2f00f4ada54519" PRIMARY KEY ("usersId", "projectsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_79e8e8e434fa7cd42ea750f2d1" ON "t_moradela"."user_projects" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4b1ceb9d93ad87f44b642a9e90" ON "t_moradela"."user_projects" ("projectsId") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."user_organizational" ("usersId" uuid NOT NULL, "organizationalId" uuid NOT NULL, CONSTRAINT "PK_d2bdb5a318feab7caefb28251dc" PRIMARY KEY ("usersId", "organizationalId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b33a83ea468a77cbab0e6b361e" ON "t_moradela"."user_organizational" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9fff79bba5a3432a93898f627" ON "t_moradela"."user_organizational" ("organizationalId") `);
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" ADD CONSTRAINT "FK_3f3814699e41cfc602b42537c4b" FOREIGN KEY ("projectId") REFERENCES "t_moradela"."projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_b29756e65982ab22b064834d2ac" FOREIGN KEY ("vehicleId") REFERENCES "t_moradela"."vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_d5e392e4ef0106120a2b4bea4be" FOREIGN KEY ("clientId") REFERENCES "t_moradela"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_21c4105c4ba2fecea287b30184c" FOREIGN KEY ("transmitterId") REFERENCES "t_moradela"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_68e0e107716d20ee96e8b70a3d0" FOREIGN KEY ("projectId") REFERENCES "t_moradela"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_aa885f359556a0137230b92c908" FOREIGN KEY ("organizationalId") REFERENCES "t_moradela"."organizational"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c" FOREIGN KEY ("rolesId") REFERENCES "t_moradela"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "FK_d422dabc78ff74a8dab6583da02" FOREIGN KEY ("permissionsId") REFERENCES "t_moradela"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_roles" ADD CONSTRAINT "FK_99b019339f52c63ae6153587380" FOREIGN KEY ("usersId") REFERENCES "t_moradela"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_roles" ADD CONSTRAINT "FK_13380e7efec83468d73fc37938e" FOREIGN KEY ("rolesId") REFERENCES "t_moradela"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" ADD CONSTRAINT "FK_79e8e8e434fa7cd42ea750f2d16" FOREIGN KEY ("usersId") REFERENCES "t_moradela"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" ADD CONSTRAINT "FK_4b1ceb9d93ad87f44b642a9e90b" FOREIGN KEY ("projectsId") REFERENCES "t_moradela"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_organizational" ADD CONSTRAINT "FK_b33a83ea468a77cbab0e6b361ea" FOREIGN KEY ("usersId") REFERENCES "t_moradela"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_organizational" ADD CONSTRAINT "FK_d9fff79bba5a3432a93898f627f" FOREIGN KEY ("organizationalId") REFERENCES "t_moradela"."organizational"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_organizational" DROP CONSTRAINT "FK_d9fff79bba5a3432a93898f627f"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_organizational" DROP CONSTRAINT "FK_b33a83ea468a77cbab0e6b361ea"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" DROP CONSTRAINT "FK_4b1ceb9d93ad87f44b642a9e90b"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" DROP CONSTRAINT "FK_79e8e8e434fa7cd42ea750f2d16"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_roles" DROP CONSTRAINT "FK_13380e7efec83468d73fc37938e"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_roles" DROP CONSTRAINT "FK_99b019339f52c63ae6153587380"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "FK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_aa885f359556a0137230b92c908"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_68e0e107716d20ee96e8b70a3d0"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_21c4105c4ba2fecea287b30184c"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_d5e392e4ef0106120a2b4bea4be"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_b29756e65982ab22b064834d2ac"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" DROP CONSTRAINT "FK_3f3814699e41cfc602b42537c4b"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_d9fff79bba5a3432a93898f627"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_b33a83ea468a77cbab0e6b361e"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."user_organizational"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_4b1ceb9d93ad87f44b642a9e90"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_79e8e8e434fa7cd42ea750f2d1"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."user_projects"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_13380e7efec83468d73fc37938"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_99b019339f52c63ae615358738"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."user_roles"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_d422dabc78ff74a8dab6583da0"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_0cb93c5877d37e954e2aa59e52"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."role_permissions"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."vehicles"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."transfers"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."users"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."roles"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."permissions"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."idx_project_name"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."projects"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."idx_organizational_name"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."organizational"`);
    }

}
