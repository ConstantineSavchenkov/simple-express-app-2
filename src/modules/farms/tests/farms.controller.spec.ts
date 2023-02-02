import config from "config/config";
import { Express } from "express";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import { LoginUserDto } from "modules/auth/dto/login-user.dto";
import { AccessToken } from "modules/auth/entities/access-token.entity";
import { CreateFarmDto } from "modules/farms/dto/create-farm.dto";
import { FarmsService } from "modules/farms/farms.service";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
//import { User } from "modules/users/entities/user.entity";
//import { User } from "modules/users/entities/user.entity";
import { UsersService } from "modules/users/users.service";
import ds from "orm/orm.config";
import { setupServer } from "server/server";
import supertest, { SuperAgentTest } from "supertest";

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

  describe("/farms router", () => {
    it("should create new farm", async () => {
      // const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);
      const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
      const createUserDto: CreateUserDto = {
        email: "user@test.com",
        password: "password",
        address: "Aia 7, 10111 Tallinn, Estonia",
      };
      const createFarmDto: CreateFarmDto = {
        name: "Viru farm",
        yield: 22,
        size: 55,
        address: "Viru väljak 4-6, 10111 Tallinn, Estonia",
      };
      await usersService.createUser(createUserDto);

      const res = await agent.post("/api/v1/auth/login").send(loginDto);
      const { token } = res.body as AccessToken;

      const res2 = await agent.post("/api/v1/farms").send(createFarmDto).set({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        Authorization: token,
      });
      expect(res2.statusCode).toBe(201);
      expect(res2.body).toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        address: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        size: expect.any(Number),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        yield: expect.any(Number),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user_id: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        createdAt: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        updatedAt: expect.any(String),
      });
    });

    it("should find all farms", async () => {
      const loginDto: LoginUserDto = { email: "user2@test.com", password: "password" };
      const createUserDto: CreateUserDto = {
        email: "user2@test.com",
        password: "password",
        address: "Aia 7, 10111 Tallinn, Estonia",
      };
      const createFarmDto: CreateFarmDto = {
        name: "Viru farm",
        yield: 22,
        size: 55,
        address: "Viru väljak 4-6, 10111 Tallinn, Estonia",
      };

      const user = await usersService.createUser(createUserDto);

      const res = await agent.post("/api/v1/auth/login").send(loginDto);
      const body = res.body as AccessToken;
      const { token } = body;

      await farmsService.createFarm(createFarmDto, user.id);

      const res2 = await agent.get("/api/v1/farms?order=name").send(createFarmDto).set({
        Authorization: token,
      });

      expect(res2.statusCode).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res2.body[0]).toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        address: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        driving_distance_km: expect.any(Number),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        size: expect.any(Number),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        yield: expect.any(Number),
      });
    });

    it("should delete farm", async () => {
      // const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);
      const loginDto: LoginUserDto = { email: "user2@test.com", password: "password" };
      const createUserDto: CreateUserDto = {
        email: "user2@test.com",
        password: "password",
        address: "Aia 7, 10111 Tallinn, Estonia",
      };
      const createFarmDto: CreateFarmDto = {
        name: "Viru farm",
        yield: 22,
        size: 55,
        address: "Viru väljak 4-6, 10111 Tallinn, Estonia",
      };

      const user = await usersService.createUser(createUserDto);

      const res = await agent.post("/api/v1/auth/login").send(loginDto);
      const body = res.body as AccessToken;
      const { token } = body;

      const farm = await farmsService.createFarm(createFarmDto, user.id);
      const res2 = await agent.delete(`/api/v1/farms/${farm.id}`).set({
        Authorization: token,
      });

      expect(res2.statusCode).toBe(200);
    });

    it("old token", async () => {
      // const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);
      const createUserDto: CreateUserDto = {
        email: "user2@test.com",
        password: "password",
        address: "Aia 7, 10111 Tallinn, Estonia",
      };
      const createFarmDto: CreateFarmDto = {
        name: "Viru farm",
        yield: 22,
        size: 55,
        address: "Viru väljak 4-6, 10111 Tallinn, Estonia",
      };

      const user = await usersService.createUser(createUserDto);

      const farm = await farmsService.createFarm(createFarmDto, user.id);
      const res2 = await agent.delete(`/api/v1/farms/${farm.id}`).set({
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkzNmNhYWJjLWYwYjMtNDA2My05NmE5LTJlNTM1NjI4ZmI0YiIsImVtYWlsIjoidXNlcjJAdGVzdC5jb20iLCJ0b2tlbklkIjoiNDI4YTJiZmEtNzQxOS00MDgzLWEyNzItMzBmNzk2ZGE4ZjhiIiwiaWF0IjoxNjc1MzQ2OTU5LCJleHAiOjE2NzUzNDY5ODN9.78199B1yKyAz1lOtqYeHFGNKyO55Ms0SYW0XT3PVJoQ",
      });

      expect(res2.statusCode).toBe(401);
    });
  });
});
