import express from "express";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import router from "./routes";
const prisma = require("../prisma/");
import cors from "cors";
config();

// initialize app
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({origin: '*',}));
app.use(express.json());

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("failed to start the server");
    await prisma.$disconnect();
    process.exit(1);
  }
};

app.use("/api/v1", router);

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
