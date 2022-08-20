import { Router } from "express";
import userRouter from "./User";

const apiRouter = Router();

apiRouter.use("/user", userRouter);

export default apiRouter;