import config from "config/config";
import { Express } from "express";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import ds from "orm/orm.config";
import { setupServer } from "server/server";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";

describe("FarmsController", () => {
  let app: Express;
  let server: Server;

  let farmsService: FarmsService;
  let usersService: UsersService;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    farmsService = new FarmsService();
    usersService = new UsersService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".createFarm", () => {
    const createFarmDto: CreateFarmDto = { name: "farm", size: 5, yield: 5, address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };

    it("should create new farm", async () => {
      const createdUser = await usersService.createUser(createUserDto);

      const createdFarm = await farmsService.createFarm(createFarmDto, createdUser.id);
      expect(createdFarm).toBeInstanceOf(Farm);
    });

  });


  describe(".UpdateFarm", () => {
    const createFarmDto: CreateFarmDto = { name: "farm", size: 5, yield: 5, address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };

    it("should update new farm", async () => {
      const createdUser = await usersService.createUser(createUserDto);

      const createdFarm = await farmsService.createFarm(createFarmDto, createdUser.id);
      await farmsService.updateFarm(createdFarm.id, { name: "name updated." }, createdUser.id);
      const foundFarm = await farmsService.findOneBy({ id: createdFarm.id });
      if (!foundFarm) {
        throw "farm not found"
      }
      expect(foundFarm.name).toBe("name updated.")
    })
  });
  describe(".findOneBy", () => {
    const createFarmDto: CreateFarmDto = { name: "farm", size: 5, yield: 5, address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };

    it("should get farm by provided param", async () => {
      const createdUser = await usersService.createUser(createUserDto);

      const farm = await farmsService.createFarm(createFarmDto, createdUser.id);
      const foundFarm = await farmsService.findOneBy({ id: farm.id, name: farm.name });
      expect(foundFarm).toMatchObject({ "name": "farm", "size": 5, "yield": 5, });
    });

    it("should return null if farm not found by provided param", async () => {
      const foundUser = await farmsService.findOneBy({ id: "6d2f1046-f745-4c54-a3d6-9c6fbae0faaf" });
      expect(foundUser).toBeNull();
    });
  });

  
  describe(".delete", () => {
    const createFarmDto: CreateFarmDto = { name: "farm", size: 5, yield: 5, address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };

    it("should delete farm by provided param", async () => {
      const createdUser = await usersService.createUser(createUserDto);

      const farm = await farmsService.createFarm(createFarmDto, createdUser.id);
      const message = await farmsService.delete({ id: farm.id });
      expect(message).toBe("farm deleted.")
    });

  });
});
