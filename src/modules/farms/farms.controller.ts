import { IVerifiedRequest } from "middlewares/verify-user-req.middleware";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { DeleteFarmDto } from "./dto/delete-farm.dto";
import { FarmDto } from "./dto/farm.dto";
import { FindFarmsDto } from "./dto/find-farms.dto";
import { Farm } from "./entities/farm.entity";
import { FarmsService } from "./farms.service";
import { NextFunction, Response } from "express";

export class FarmsController {
  private readonly farmsService: FarmsService;

  constructor() {
    this.farmsService = new FarmsService();
  }

  public async create(req: IVerifiedRequest, res: Response, next: NextFunction) {
    try {
      const farm: Farm = await this.farmsService.createFarm(req.body as CreateFarmDto, req.userId);
      res.status(201);
      res.send(FarmDto.createFromEntity(farm));
    } catch (err) {
      next(err);
    }
  }

  public async delete(req: IVerifiedRequest, res: Response, next: NextFunction) {
    try {
      await this.farmsService.deleteFarm(req.params as unknown as DeleteFarmDto, req.userId);
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  }

  public async find(req: IVerifiedRequest, res: Response, next: NextFunction) {
    try {
      const farms: Farm[] = await this.farmsService.findAllFarms(req.query as unknown as FindFarmsDto, req.userId);
      res.status(200).send(farms.map(el => FarmDto.createFromEntity(el)));
    } catch (err) {
      next(err);
    }
  }
}
