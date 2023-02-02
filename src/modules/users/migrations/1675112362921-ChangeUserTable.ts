import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserTable1675112362921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "longitude" DOUBLE PRECISION NOT NULL CHECK(longitude > -180 and longitude <= 180)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "latitude" DOUBLE PRECISION NOT NULL CHECK(latitude > -90 and latitude <= 90)`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "coordinates" GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "longitude"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "latitude"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coordinates"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
  }
}
