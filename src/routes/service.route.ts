import { Router } from "express";
import { createBaseService, selectBaseServices, SelectProvidersByService, SelectProviderService } from "../controllers/service.controller";
import { VerifyAccessToken } from "../middelwares/verifyToken";

const serviceRouter = Router();

serviceRouter.post("/create-service", createBaseService);
serviceRouter.get("/base-services", selectBaseServices);
serviceRouter.get("/service-providers/:id", SelectProvidersByService);
serviceRouter.get("/provider-services",VerifyAccessToken,SelectProviderService);


export default serviceRouter;
