import { MigrationInterface, QueryRunner } from "typeorm";

export class Moradela1748414728595 implements MigrationInterface {
    name = 'Moradela1748414728595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "t_moradela"."organizational" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, CONSTRAINT "PK_b6c9f02eeb7ca92136f9a9e43f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_organizational_name" ON "t_moradela"."organizational" ("name") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2187088ab5ef2a918473cb99007" UNIQUE ("name"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_project_name" ON "t_moradela"."projects" ("name") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "refresh_token_hash" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."transfers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "vehicleId" uuid, "clientId" uuid, "transmitterId" uuid, "projectId" uuid, "organizationalId" uuid, CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plate" character varying NOT NULL, "service" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ec7181ebdab798d97070122a5bf" UNIQUE ("plate"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."tenancy" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_53823ab6f0fc6def2626c983f0b" UNIQUE ("name"), CONSTRAINT "PK_c98009ac41a45bd29d8a56431ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_moradela"."role_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "t_moradela"."role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "t_moradela"."role_permissions" ("permission_id") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "t_moradela"."user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "t_moradela"."user_roles" ("role_id") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."user_projects" ("user_id" uuid NOT NULL, "project_id" uuid NOT NULL, CONSTRAINT "PK_f1cb6930858fc19acfac1ce4e54" PRIMARY KEY ("user_id", "project_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86ef6061f6f13aa9252b12cbe8" ON "t_moradela"."user_projects" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c6aaf014ba0d66a74bb552272" ON "t_moradela"."user_projects" ("project_id") `);
        await queryRunner.query(`CREATE TABLE "t_moradela"."user_organizational" ("user_id" uuid NOT NULL, "organizational_id" uuid NOT NULL, CONSTRAINT "PK_e1952a81f4c3901baf613b961ba" PRIMARY KEY ("user_id", "organizational_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e23fcbb3bb0be87075f3a175eb" ON "t_moradela"."user_organizational" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e69e1d1f6767dc0b282ffe3d28" ON "t_moradela"."user_organizational" ("organizational_id") `);
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" ADD CONSTRAINT "FK_3f3814699e41cfc602b42537c4b" FOREIGN KEY ("projectId") REFERENCES "t_moradela"."projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_b29756e65982ab22b064834d2ac" FOREIGN KEY ("vehicleId") REFERENCES "t_moradela"."vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_d5e392e4ef0106120a2b4bea4be" FOREIGN KEY ("clientId") REFERENCES "t_moradela"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_21c4105c4ba2fecea287b30184c" FOREIGN KEY ("transmitterId") REFERENCES "t_moradela"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_68e0e107716d20ee96e8b70a3d0" FOREIGN KEY ("projectId") REFERENCES "t_moradela"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_aa885f359556a0137230b92c908" FOREIGN KEY ("organizationalId") REFERENCES "t_moradela"."organizational"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "t_moradela"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "t_moradela"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "t_moradela"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "t_moradela"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" ADD CONSTRAINT "FK_86ef6061f6f13aa9252b12cbe87" FOREIGN KEY ("user_id") REFERENCES "t_moradela"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" ADD CONSTRAINT "FK_4c6aaf014ba0d66a74bb5522726" FOREIGN KEY ("project_id") REFERENCES "t_moradela"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_organizational" ADD CONSTRAINT "FK_e23fcbb3bb0be87075f3a175eb8" FOREIGN KEY ("user_id") REFERENCES "t_moradela"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_organizational" ADD CONSTRAINT "FK_e69e1d1f6767dc0b282ffe3d28a" FOREIGN KEY ("organizational_id") REFERENCES "t_moradela"."organizational"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_organizational" DROP CONSTRAINT "FK_e69e1d1f6767dc0b282ffe3d28a"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_organizational" DROP CONSTRAINT "FK_e23fcbb3bb0be87075f3a175eb8"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" DROP CONSTRAINT "FK_4c6aaf014ba0d66a74bb5522726"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_projects" DROP CONSTRAINT "FK_86ef6061f6f13aa9252b12cbe87"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_aa885f359556a0137230b92c908"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_68e0e107716d20ee96e8b70a3d0"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_21c4105c4ba2fecea287b30184c"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_d5e392e4ef0106120a2b4bea4be"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_b29756e65982ab22b064834d2ac"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."organizational" DROP CONSTRAINT "FK_3f3814699e41cfc602b42537c4b"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_e69e1d1f6767dc0b282ffe3d28"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_e23fcbb3bb0be87075f3a175eb"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."user_organizational"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_4c6aaf014ba0d66a74bb552272"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_86ef6061f6f13aa9252b12cbe8"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."user_projects"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."user_roles"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "t_moradela"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."role_permissions"`);
        await queryRunner.query(`DROP TABLE "t_moradela"."tenancy"`);
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
