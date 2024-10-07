import { Request, Response, Router } from "express";
import {
  logout,
  send_otp,
  signin,
  signup,
  verify_otp,
} from "../controllers/auth.controller";
import errorHandler from "../middelwares/errorHandel";
import { VerifyAccessToken } from "../middelwares/verifyToken";
import { selectUsers } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/sendotp", send_otp);
userRouter.post("/verfiyotp", verify_otp);
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/logout", VerifyAccessToken, logout);
userRouter.get("/users", selectUsers);

export default userRouter;
