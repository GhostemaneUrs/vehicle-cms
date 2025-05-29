import { MigrationInterface, QueryRunner } from "typeorm";

export class Moradela1748519766160 implements MigrationInterface {
    name = 'Moradela1748519766160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_aa885f359556a0137230b92c908"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_68e0e107716d20ee96e8b70a3d0"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_21c4105c4ba2fecea287b30184c"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_d5e392e4ef0106120a2b4bea4be"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_b29756e65982ab22b064834d2ac"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "vehicleId"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "transmitterId"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "organizationalId"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "vehicle_id" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "client_id" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "transmitter_id" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "project_id" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "organizational_id" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_4a5eedc863f271f9a6c9a17dab3" FOREIGN KEY ("vehicle_id") REFERENCES "t_moradela"."vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_9249ca69c046f687f06bafa43bb" FOREIGN KEY ("client_id") REFERENCES "t_moradela"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_b51bdb870765d09872dd4400451" FOREIGN KEY ("transmitter_id") REFERENCES "t_moradela"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_fc2701ec117b3be7833dd385de0" FOREIGN KEY ("project_id") REFERENCES "t_moradela"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_c7a869d73351e7a245bb981c5bc" FOREIGN KEY ("organizational_id") REFERENCES "t_moradela"."organizational"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_c7a869d73351e7a245bb981c5bc"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_fc2701ec117b3be7833dd385de0"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_b51bdb870765d09872dd4400451"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_9249ca69c046f687f06bafa43bb"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP CONSTRAINT "FK_4a5eedc863f271f9a6c9a17dab3"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "organizational_id"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "transmitter_id"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "client_id"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" DROP COLUMN "vehicle_id"`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "organizationalId" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "transmitterId" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "clientId" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD "vehicleId" uuid`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_b29756e65982ab22b064834d2ac" FOREIGN KEY ("vehicleId") REFERENCES "t_moradela"."vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_d5e392e4ef0106120a2b4bea4be" FOREIGN KEY ("clientId") REFERENCES "t_moradela"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_21c4105c4ba2fecea287b30184c" FOREIGN KEY ("transmitterId") REFERENCES "t_moradela"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_68e0e107716d20ee96e8b70a3d0" FOREIGN KEY ("projectId") REFERENCES "t_moradela"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_moradela"."transfers" ADD CONSTRAINT "FK_aa885f359556a0137230b92c908" FOREIGN KEY ("organizationalId") REFERENCES "t_moradela"."organizational"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
