import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFarmTable1675197328149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "farm" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "size" DOUBLE PRECISION NOT NULL,
        "yield" DOUBLE PRECISION,
        "address" character varying NOT NULL,
        "longitude" DOUBLE PRECISION NOT NULL CHECK(longitude > -180 and longitude <= 180),
        "latitude" DOUBLE PRECISION NOT NULL CHECK(latitude > -90 and latitude <= 90),
        "coordinates" geometry(Point,4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP DEFAULT now(), 
        "user_id" uuid NOT NULL,
        PRIMARY KEY ("id"),
        FOREIGN KEY ("user_id") REFERENCES "user"("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "farm"`);
  }
}
