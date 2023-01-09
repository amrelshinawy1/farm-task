import { Router } from "express";
import { verifyToken } from "middlewares/verify.token";
import auth from "./auth.routes";
import farm from "./farm.routes";
import user from "./user.routes";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/farms", verifyToken, farm);

export default routes;
