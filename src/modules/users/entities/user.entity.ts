import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Check } from "typeorm";
import { Point } from "geojson";

@Entity()
@Check(`longitude > -180 and longitude <= 180`)
@Check(`latitude > -90 and latitude <= 90`)
export class User {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  public address: string;

  @Column({
    name: "longitude",
    type: "double precision",
    nullable: false,
  })
  public longitude: number;

  @Column({
    name: "latitude",
    type: "double precision",
    nullable: false,
  })
  public latitude: number;

  @Column({
    name: "coordinates",
    nullable: false,
    type: "geometry",
    spatialFeatureType: "Point",
    srid: 4326,
    generatedType: 'STORED',
    asExpression: 'SRID=4326;POINT(longitude latitude)'
  })
  public coordinates: Point;
}
