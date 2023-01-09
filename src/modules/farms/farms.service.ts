/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UsersService } from "modules/users/users.service";
import dataSource from "orm/orm.config";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { paginate } from "./dto/boilerplate.polyfill";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { PageMetaDto } from "./dto/pageMetaDto";
import { PageOptionsDto } from "./dto/pageOptionsDto";
import { Farm } from "./entities/farm.entity";

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;
  private readonly usersService: UsersService;

  constructor() {
    this.farmsRepository = dataSource.getRepository(Farm);
    this.usersService = new UsersService();
  }

  public async createFarm(data: CreateFarmDto, userId: string): Promise<Farm> {
    const { name, size, yield: farmYield, address, coordinates: { latitude, longitude } } = data;

    const farmData: DeepPartial<Farm> = {
      user:{id: userId},
      name,
      size,
      yield: farmYield,
      address,
      coordinates: {
        type: "Point",
        coordinates: [longitude, latitude],
      }
    };

    const newFarm = this.farmsRepository.create(farmData);
    return this.farmsRepository.save(newFarm);
  }

  public async findAll(paginationOptions: PageOptionsDto, userId: string): Promise<[Farm[], PageMetaDto]> {
    const user = await this.usersService.findOneBy({id: userId});
    if(!user){
      throw "user not found.";
    }
    console.log(user)
    const farmQuery = this.farmsRepository
    .createQueryBuilder("farm")
    .leftJoinAndSelect("farm.user", "user")
    .select([
      "farm.name as name",
      "farm.address as address",
      "farm.size as size",
      "farm.yield as yield",
      "user.email as owner"
    ])
    farmQuery.addSelect(`round(CAST(st_distancespheroid("farm"."coordinates", st_setsrid(st_makepoint(${user.coordinates.coordinates[1]},${user.coordinates.coordinates[0]}),4326))As numeric),2) as driving_distance`)
    const response = await paginate(farmQuery, paginationOptions);
    return response;
  }

  public async updateFarm(id: string, farmData: DeepPartial<Farm>, userId: string): Promise<void> {

    const farm = await this.findOneBy({id, user:{id:userId}})
    if(!farm){
      return;
    }

    await this.farmsRepository.update({id}, farmData);
  }
  public async findOneBy(param: FindOptionsWhere<Farm>): Promise<Farm | null> {
    return this.farmsRepository.findOneBy({ ...param });
  }

  public async delete(param: FindOptionsWhere<Farm>): Promise<string> {
    await this.farmsRepository.delete({ ...param });
    return "farm deleted."
  }
}
