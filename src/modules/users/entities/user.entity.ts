import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IGeometry } from "./user.interface";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

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
