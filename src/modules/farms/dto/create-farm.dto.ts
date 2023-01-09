import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ILocation } from "../entities/farm.interface";

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @IsNotEmpty()
  public size: number;


  @IsNumber()
  @IsNotEmpty()
  public yield: number;
  
  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsNumber()
  @IsNotEmpty()
  public coordinates:ILocation
}
