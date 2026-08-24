import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameZipcodeTozonecode1787510537278 implements MigrationInterface {
    name = 'RenameZipcodeTozonecode1787510537278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" RENAME COLUMN "zipcode" TO "zonecode"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" RENAME COLUMN "zonecode" TO "zipcode"`);
    }

}
