import { CreateFarmDto } from "modules/farms/dto/create-farm.dto";
import { Farm } from "modules/farms/entities/farm.entity";
import { FarmsService } from "modules/farms/farms.service";
import { MigrationInterface, QueryRunner } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";
import { UsersService } from "../users.service";

export class seed1673222714112 implements MigrationInterface {

    public async up(): Promise<void> {
        const users: CreateUserDto[] = [
            { email: "test1@gmail.com", password: "123456", address: "test address 1", coordinates: { latitude: 30.1, longitude: 30.2 } },
            { email: "test1@gmai2.com", password: "123456", address: "test address 2", coordinates: { latitude: 30.3, longitude: 30.4 } },
            { email: "test1@gmai3.com", password: "123456", address: "test address 3", coordinates: { latitude: 30.5, longitude: 30.6 } },
            { email: "test1@gmai4.com", password: "123456", address: "test address 4", coordinates: { latitude: 30.7, longitude: 30.8 } }
        ];
        const farms: CreateFarmDto[] = [
            { name: "farm1", size: 8.6, yield: 3.3, address: "test address 1", coordinates: { latitude: 30.1, longitude: 30.2 } },
            { name: "farm2", size: 8.6, yield: 3.3, address: "test address 2", coordinates: { latitude: 30.3, longitude: 30.4 } },
            { name: "farm3", size: 8.6, yield: 3.3, address: "test address 3", coordinates: { latitude: 30.5, longitude: 30.6 } },
            { name: "farm4", size: 8.6, yield: 3.3, address: "test address 4", coordinates: { latitude: 30.7, longitude: 30.8 } }
        ];
        const userService = new UsersService();
        const farmService = new FarmsService();
        for (const user of users) {
            const createdUser = await userService.createUser(user);
            for (const farm of farms) {
                await farmService.createFarm(farm, createdUser.id);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all([
            queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(User)
                .execute(),
            queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(Farm)
                .execute(),
        ])

    }

}
