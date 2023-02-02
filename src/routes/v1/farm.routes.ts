import { RequestHandler, Router } from "express";
import { FarmsController } from "modules/farms/farms.controller";

const router = Router();
const farmsController = new FarmsController();

router.get("/", farmsController.find.bind(farmsController) as RequestHandler);
router.post("/", farmsController.create.bind(farmsController) as RequestHandler);
router.delete("/:id", farmsController.delete.bind(farmsController) as RequestHandler);

export default router;
