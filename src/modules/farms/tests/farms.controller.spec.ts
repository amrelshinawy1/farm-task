/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import config from "config/config";
import { Express } from "express";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import { LoginUserDto } from "modules/auth/dto/login-user.dto";
import { CreateFarmDto } from "modules/farms/dto/create-farm.dto";
import { FarmsService } from "modules/farms/farms.service";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import ds from "orm/orm.config";
import { setupServer } from "server/server";
import supertest, { SuperAgentTest } from "supertest";
import { UpdateFarmDto } from "../dto/update-farm.dto";

describe("FarmsController", () => {
  let app: Express;
  let agent: SuperAgentTest;
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
    agent = supertest.agent(app);

    farmsService = new FarmsService();
    usersService = new UsersService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe("POST /farms", () => {
    const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);
    const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };
    const createFarmDto: CreateFarmDto = { name: "farm", size: 5, yield: 5, address: "test address", coordinates: { latitude: 30.1, longitude: 30.2 } };

    it("should create new farm", async () => {

      await createUser(createUserDto);
      const loginRes = await agent.post("/api/v1/auth/login").send(loginDto);
      const headers = { Authorization: loginRes.body.token };

      const res = await agent.post("/api/v1/farms")
        .send(createFarmDto)
        .set(headers);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should update farms", async () => {
      await createUser(createUserDto);

      const loginRes = await agent.post("/api/v1/auth/login").send(loginDto);
      const headers = { Authorization: loginRes.body.token };

      const user = await usersService.findOneBy({email: loginDto.email});
      if(!user){
        throw "user not found.";
      }
      console.log(user)
     const farm =  await farmsService.createFarm(createFarmDto, user.id);
      console.log(farm)
      const updateFarmDto: Partial<UpdateFarmDto> = { name: "farm updated", size: 5, yield: 5};

      const res = await agent.put(`/api/v1/farms/${farm.id}`).send(updateFarmDto).set(headers);

      expect(res.statusCode).toBe(200);
      const updatedFarm =  await farmsService.findOneBy({id: farm.id, user:{id:user.id}});
      if(!updatedFarm){
        throw "farm not found"
      }
      expect(updatedFarm.name).toBe("farm updated");

    });

    
    it("should get one farm", async () => {
      await createUser(createUserDto);

      const loginRes = await agent.post("/api/v1/auth/login").send(loginDto);
      const headers = { Authorization: loginRes.body.token };

      const user = await usersService.findOneBy({email: loginDto.email});
      if(!user){
        throw "user not found.";
      }
     const farm =  await farmsService.createFarm(createFarmDto, user.id);

      const res = await agent.get(`/api/v1/farms/${farm.id}`).set(headers);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("farm found.");

    });
    it("should delete farms", async () => {
      await createUser(createUserDto);

      const loginRes = await agent.post("/api/v1/auth/login").send(loginDto);
      const headers = { Authorization: loginRes.body.token };

      const user = await usersService.findOneBy({email: loginDto.email});
      if(!user){
        throw "user not found.";
      }
     const farm =  await farmsService.createFarm(createFarmDto, user.id);

      const res = await agent.delete(`/api/v1/farms/${farm.id}`).set(headers);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("farm deleted.");

    });
  });
});
