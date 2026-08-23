import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAddress1787495553216 implements MigrationInterface {
    name = 'CreateAddress1787495553216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "zonecode" character varying NOT NULL, "roadAddress" character varying NOT NULL, "detailAddress" character varying NOT NULL, "userId" uuid, "timeStampCreatedat" TIMESTAMP NOT NULL DEFAULT now(), "timeStampUpdatedat" TIMESTAMP NOT NULL DEFAULT now(), "timeStampDeletedat" TIMESTAMP, CONSTRAINT "REL_d25f1ea79e282cc8a42bd616aa" UNIQUE ("userId"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "timeStampCreatedat" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "timeStampUpdatedat" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "timeStampDeletedat" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "timeStampDeletedat"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "timeStampUpdatedat"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "timeStampCreatedat"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
