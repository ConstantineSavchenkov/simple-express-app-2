import { Repository } from "typeorm";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { DeleteFarmDto } from "./dto/delete-farm.dto";
import { FarmSortingFields, FindFarmsDto } from "./dto/find-farms.dto";
import { Farm } from "./entities/farm.entity";
import dataSource from "orm/orm.config";
import { User } from "modules/users/entities/user.entity";
import { fetchCoordinates, fetchDestinations } from "helpers/utils";

import { Logger } from "../../helpers/logger";
const logger = new Logger("FarmsService");

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;
  private readonly userRepository: Repository<User>;

  constructor() {
    this.farmsRepository = dataSource.getRepository(Farm);
    this.userRepository = dataSource.getRepository(User);
  }

  public async createFarm(data: CreateFarmDto, userId: string): Promise<Farm> {
    try {
      logger.info(userId, "creating farm..");
      const coordinates = await fetchCoordinates(userId, data.address);
      const newFarm = this.farmsRepository.create({
        ...data,
        user_id: userId,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        createdAt: new Date(),
      });
      return await this.farmsRepository.save(newFarm);
    } catch (err) {
      logger.error(userId, "error while creating farm", err);
      throw err;
    }
  }

  public async deleteFarm(data: DeleteFarmDto, userId: string): Promise<void> {
    try {
      logger.info(userId, "deleting farm..", data.id);
      await dataSource
        .createQueryBuilder()
        .delete()
        .from(Farm)
        .where("id = :id and user_id = :userId", { id: data.id, userId })
        .execute();
    } catch (err) {
      logger.error(userId, "error while deleting farm", err);
      throw err;
    }
  }

  public async findAllFarms(data: FindFarmsDto, userId: string): Promise<Farm[]> {
    try {
      logger.info(userId, "querying farm list ..");
      const user = await this.userRepository.findOne({ where: { id: userId } });
      let avg;
      let max;
      let min;
      const limit: number = data.limit || 5; // todo: move default value to config
      const offset: number = data.offset || 0;
      const extraLimit: number = limit * 2; // todo: move default value to config

      // todo: research ways to use ST_Distance with QueryBuilder
      // solution below is not agile but does the job

      let select = `
     SELECT farm.id as id, name, farm.address as address, email, size, yield, farm.latitude as latitude, farm.longitude as longitude, 
     ST_Distance(farm.coordinates::geography, 'SRID=4326;POINT(${user?.longitude} ${user?.latitude})'::geography)/1000 as driving_distance
     FROM farm
     INNER JOIN "user" as u
        ON u.id=farm.user_id
     `;

      if (data.outliers) {
        logger.info(userId, "outliers filter applied");
        const res = (await this.farmsRepository.createQueryBuilder("farm").select("AVG(yield)", "avg").getRawOne()) as {
          avg: number;
        };
        avg = res.avg;
        max = avg + (avg / 100) * 30;
        min = avg - (avg / 100) * 30;
        select += `
        WHERE yield > ${max} OR yield < ${min}
        `;
      }

      if (data.sort === FarmSortingFields.DRIVING_DISTANCE) {
        logger.info(userId, "DRIVING_DISTANCE sorting option active");
        // todo: pass n closest (n === page size) farms to External driving matrix api or use pgRouting extension
        // to make result more accurate
        select += `
        ORDER BY farm.coordinates <-> 'SRID=4326;POINT(${user?.longitude} ${user?.latitude})'
        `;
      } else if (data.sort === FarmSortingFields.DATE) {
        logger.info(userId, "DATE sorting option active");
        select += `
        ORDER BY farm."createdAt"
        `;
      } else {
        logger.info(userId, "NAME sorting option active (default)");
        select += `
        ORDER BY name
        `;
      }

      select += `
      LIMIT ${extraLimit} OFFSET ${offset};
      `;

      const result: Farm[] = (await this.farmsRepository.query(select)) as Farm[];

      logger.info(userId, "picking driving destinations");
      const destinations = await fetchDestinations(
        userId,
        { lat: user?.latitude as number, lng: user?.longitude as number },
        result.map(el => ({ lat: el.latitude, lng: el.longitude })),
      );

      for (let index = 0; index < result.length; index++) {
        result[index].driving_distance = destinations[index].value;
      }

      return result.sort((a, b) => a.driving_distance - b.driving_distance);
    } catch (err) {
      logger.error(userId, "error while querying farm list", err);
      throw err;
    }
  }
}
