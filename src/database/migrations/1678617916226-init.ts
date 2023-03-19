import { MigrationInterface, QueryRunner } from "typeorm";

export class init1678617916226 implements MigrationInterface {
    name = 'init1678617916226'


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "display_name" character varying, "last_login_at" TIMESTAMP, "address" character varying, "phone_number" character varying, "avatar_url" character varying, "access_token" character varying, "refresh_token" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
