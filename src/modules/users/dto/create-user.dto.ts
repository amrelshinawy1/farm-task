import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ILocation } from "../entities/user.interface";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  
  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsNumber()
  @IsNotEmpty()
  public coordinates:ILocation
}
