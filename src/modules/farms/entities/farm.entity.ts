import { Check, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, Generated } from "typeorm";
//import { User } from "../../users/entities/user.entity";

@Entity()
@Check(`longitude > -180 and longitude <= 180`)
@Check(`latitude > -90 and latitude <= 90`)
@Index("farm_coordinates_idx", { synchronize: false })
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column()
  public user_id: string;

  @Column({
    type: "double precision",
    nullable: false,
  })
  public size: number;

  @Column({
    type: "double precision",
    nullable: true,
  })
  public yield: number;

  @Column({
    name: "address",
    type: "text",
    nullable: false,
  })
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

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Generated()
  public driving_distance_km: number
}
