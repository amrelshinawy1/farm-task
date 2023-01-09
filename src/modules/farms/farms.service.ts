import dataSource from "orm/orm.config";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { Farm } from "./entities/farm.entity";

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;

  constructor() {
    this.farmsRepository = dataSource.getRepository(Farm);
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
