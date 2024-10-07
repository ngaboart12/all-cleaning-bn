import { Router } from "express";

import { VerifyAccessToken } from "../middelwares/verifyToken";
import { AllProviders, completeService } from "../controllers/provider.conroller";

const providerRouter = Router();

providerRouter.post("/complete/service/:id", VerifyAccessToken, completeService);
providerRouter.get("/services", VerifyAccessToken, completeService);
providerRouter.get("/provider/services/:id", VerifyAccessToken, completeService);
providerRouter.get("/service/:id", VerifyAccessToken, completeService);

providerRouter.get("/providers",AllProviders);


export default providerRouter;
