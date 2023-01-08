import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ColumnNumericTransformer } from "./column.numeric.transformer";
import { IGeometry } from "./farm.interface";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  public size: number;
  
  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  public yield: number;

  @Column({
    name: "address",
    type: "text",
    nullable: true,
  })
  public address: string;

  @Column({
    name: "coordinates",
    type: "geometry",
    nullable: true,
    spatialFeatureType: "Point",
    srid: 4326
  })
  public coordinates: IGeometry;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}

