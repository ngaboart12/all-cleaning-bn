import { Request, Response, Router } from "express";
import userRouter from "./user.router";
import serviceRouter from "./service.route";
import providerRouter from "./provider.route";

const router = Router()

// user routes and authentication
router.use("/user", userRouter)
router.use("/service", serviceRouter)
router.use("/provider", providerRouter)


export default router