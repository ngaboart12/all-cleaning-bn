import express from "express";
import { VerifyAccessToken } from "../middelwares/verifyToken";
import { authorizeRoles } from "../middelwares/checkRoles";


const router = express.Router();

router.get("/admin", VerifyAccessToken, authorizeRoles("ADMIN"), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

router.get("/provider", VerifyAccessToken, authorizeRoles("PROVIDER"), (req, res) => {
  res.status(200).json({ message: "Welcome, Provider!" });
});

router.get("/client", VerifyAccessToken, authorizeRoles("CLIENT"), (req, res) => {
  res.status(200).json({ message: "Welcome, Client!" });
});

export default router;
