import { NextFunction, Response } from "express";
import { IPrivateRequest } from "middlewares/verify.token";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { PageOptionsDto } from "./dto/pageOptionsDto";
import { UpdateFarmDto } from "./dto/update-farm.dto";
import { Farm } from "./entities/farm.entity";
import { FarmsService } from "./farms.service";

export class FarmsController {
  private readonly farmsService: FarmsService;

  constructor() {
    this.farmsService = new FarmsService();
  }

  public async create(req: IPrivateRequest, res: Response, next: NextFunction) {
    try {
      const farm: Farm = await this.farmsService.createFarm(req.body as CreateFarmDto, req.tokenData.id);
      return res.status(201).send(farm);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  public async getAll(req: IPrivateRequest, res: Response, next: NextFunction) {
    try {
      const pageOptionsDto: PageOptionsDto = req.query as unknown as PageOptionsDto;

      const farms = await this.farmsService.findAll(pageOptionsDto, req.tokenData.id);
      return res.status(200).send({ message: "farms found.", farms });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  
  public async update(req: IPrivateRequest, res: Response, next: NextFunction) {
    try {
      const farmToUpdate = req.body as UpdateFarmDto
      await this.farmsService.updateFarm(req.params.id, farmToUpdate, req.tokenData.id);
      return res.status(200).send({ message: "farm updated." });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  public async getOne(req: IPrivateRequest, res: Response, next: NextFunction) {
    try {
      const farm = await this.farmsService.findOneBy({ id: req.params.id, user: { id: req.tokenData.id } });
      return res.status(200).send({ message: "farm found.", farm });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  
  public async delete(req: IPrivateRequest, res: Response, next: NextFunction) {
    try {
      const message = await this.farmsService.delete({ id: req.params.id, user: { id: req.tokenData.id } });
      return res.status(200).send({ message });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
