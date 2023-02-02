import { Router } from "express";
import auth from "./auth.routes";
import user from "./user.routes";
import farm from "./farm.routes";
import { verifyRequest } from "middlewares/verify-user-req.middleware";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/farms", verifyRequest, farm);

export default routes;
