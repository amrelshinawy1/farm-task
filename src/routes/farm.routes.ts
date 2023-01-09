import { RequestHandler, Router } from "express";
import { FarmsController } from "modules/farms/farms.controller";

const router = Router();
const farmsController = new FarmsController();

router.post("/", farmsController.create.bind(farmsController) as RequestHandler);
router.get("/", farmsController.getAll.bind(farmsController) as RequestHandler);
router.put("/:id", farmsController.update.bind(farmsController) as RequestHandler);
router.get("/:id", farmsController.getOne.bind(farmsController) as RequestHandler);
router.delete("/:id", farmsController.delete.bind(farmsController) as RequestHandler);
export default router;
