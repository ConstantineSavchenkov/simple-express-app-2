import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndex1675291050697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX farm_coordinates_idx ON farm USING gist(coordinates)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX farm_coordinates_idx`);
  }
}
