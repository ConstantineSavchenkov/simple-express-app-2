import { SeedingSource } from "@concepta/typeorm-seeding";
import config from "config/config";
import { Express } from "express";
import { InitialSeed } from "helpers/seeding/seeds/initialSeed";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { User } from "modules/users/entities/user.entity";
import { UsersService } from "modules/users/users.service";
import ds from "orm/orm.config";
import { setupServer } from "server/server";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { FarmSortingFields } from "../dto/find-farms.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";

//TODO: make coordinate locator injectable dependency
// to speed up tests

describe("FarmsService", () => {
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
    const createFarmDto: CreateFarmDto = {
      name: "usa embassy farm",
      size: 20,
      yield: 15,
      address: "Kentmanni 20, 10116 Tallinn, Estonia",
    };
    const createUserDto: CreateUserDto = {
      email: "kek@test.com",
      password: "password",
      address: "Herne 4, 10135 Tallinn, Estonia",
    };

    it("should create new farm", async () => {
      const createdUser = await usersService.createUser(createUserDto);
      const createdFarm = await farmsService.createFarm(createFarmDto, createdUser.id);
      expect(createdFarm).toBeInstanceOf(Farm);
    });
  });

  describe(".findAll", () => {
    const createFarmDto: CreateFarmDto = {
      name: "EKKM farm",
      size: 2,
      yield: 77,
      address: "Kursi 5, 10415 Tallinn, Estonia",
    };
    const createFarmDto2: CreateFarmDto = {
      name: "Rimi farm",
      size: 20,
      yield: 25,
      address: " Aia 7, 10111 Tallinn, Estonia",
    };
    const createFarmDto3: CreateFarmDto = {
      name: "Nautica farm",
      size: 20,
      yield: 22,
      address: "Ahtri 9, 10151 Tallinn, Estonia",
    };
    const createFarmDto4: CreateFarmDto = {
      name: "Vene farm",
      size: 2,
      yield: 5,
      address: "Vabaduse väljak 5, 10141 Tallinn, Estonia",
    };
    const createFarmDto5: CreateFarmDto = {
      name: "XXX farm",
      size: 2,
      yield: 26,
      address: "Allveelaeva 6, Põhja-Tallinna linnaosa, Põhja, 10411 Tallinn, Estonia",
    };
    const createUserDto: CreateUserDto = {
      email: "kosta@test.com",
      password: "password",
      address: "Herne 4, 10135 Tallinn, Estonia",
    };

    let farm: Farm, farm2: Farm, farm3: Farm, farm4: Farm, farm5: Farm, createdUser: User;

    beforeEach(async () => {
      createdUser = await usersService.createUser(createUserDto);
      farm = await farmsService.createFarm(createFarmDto, createdUser.id);
      farm2 = await farmsService.createFarm(createFarmDto2, createdUser.id);
      farm3 = await farmsService.createFarm(createFarmDto3, createdUser.id);
      farm4 = await farmsService.createFarm(createFarmDto4, createdUser.id);
      farm5 = await farmsService.createFarm(createFarmDto5, createdUser.id);
    }, 10000);

    it("closest farms", async () => {
      const farms = await farmsService.findAllFarms({ sort: FarmSortingFields.DRIVING_DISTANCE }, createdUser.id);
      expect(farms[0].id).toEqual(farm4.id);
      expect(farms[1].id).toEqual(farm2.id);
      expect(farms[2].id).toEqual(farm.id);
      expect(farms[3].id).toEqual(farm3.id);
      expect(farms[4].id).toEqual(farm5.id);
    });

    it("farms by creation", async () => {
      const farms = await farmsService.findAllFarms({ sort: FarmSortingFields.DATE }, createdUser.id);
      expect(farms[0].id).toEqual(farm.id);
      expect(farms[1].id).toEqual(farm2.id);
      expect(farms[2].id).toEqual(farm3.id);
      expect(farms[3].id).toEqual(farm4.id);
      expect(farms[4].id).toEqual(farm5.id);
    });

    it("farms by name", async () => {
      const farms = await farmsService.findAllFarms({ sort: FarmSortingFields.NAME }, createdUser.id);
      expect(farms[0].id).toEqual(farm.id);
      expect(farms[1].id).toEqual(farm3.id);
      expect(farms[2].id).toEqual(farm2.id);
      expect(farms[3].id).toEqual(farm4.id);
      expect(farms[4].id).toEqual(farm5.id);
    });

    it("outliers farms", async () => {
      const farms = await farmsService.findAllFarms({ sort: FarmSortingFields.NAME, outliers: true }, createdUser.id);
      expect(farms[0].id).toEqual(farm.id);
      expect(farms[1].id).toEqual(farm4.id);
      expect(farms.length).toEqual(2);
    });

    it("outliers farms + closest", async () => {
      const farms = await farmsService.findAllFarms({ sort: FarmSortingFields.DRIVING_DISTANCE, outliers: true }, createdUser.id);
      expect(farms[0].id).toEqual(farm4.id);
      expect(farms[1].id).toEqual(farm.id);
      expect(farms.length).toEqual(2);
    });

    it("closest farms with seed", async () => {
      const ss = new SeedingSource({
        dataSource: ds,
        seeders: [InitialSeed],
      });
      await ss.run.all();
      const farms = await farmsService.findAllFarms({ sort: FarmSortingFields.DRIVING_DISTANCE }, createdUser.id);
      expect(
        farms[0].driving_distance < farms[1].driving_distance &&
          farms[1].driving_distance < farms[2].driving_distance,
      ).toEqual(true);
    });

    it("closest farms + pagination", async () => {
      const farms = await farmsService.findAllFarms(
        {
          sort: FarmSortingFields.DRIVING_DISTANCE,
          limit: 2,
          offset: 1,
        },
        createdUser.id,
      );
      expect(farms[0].id).toEqual(farm2.id);
      expect(farms[1].id).toEqual(farm.id);
    });
  });

  describe(".delete", () => {
    const createFarmDto: CreateFarmDto = {
      name: "usa embassy farm",
      size: 20,
      yield: 15,
      address: "Kentmanni 20, 10116 Tallinn, Estonia",
    };
    const createUserDto: CreateUserDto = {
      email: "kosta@test.com",
      password: "password",
      address: "Herne 4, 10135 Tallinn, Estonia",
    };

    it("should delete farm by provided param", async () => {
      const createdUser = await usersService.createUser(createUserDto);

      const farm = await farmsService.createFarm(createFarmDto, createdUser.id);
      await farmsService.deleteFarm({ id: farm.id }, createdUser.id);
    });
  });
});
