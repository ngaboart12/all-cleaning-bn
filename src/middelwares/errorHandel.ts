// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClientValidationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  // Handle Prisma validation errors
  if (err instanceof PrismaClientValidationError) {
    return res.status(400).json({ message: "Validation error: " + err.message });
  }

  // Handle known request errors (like unique constraint violation)
  if (err instanceof PrismaClientKnownRequestError) {
    return res.status(400).json({ message: "Request error: " + err.message });
  }

  // Handle other errors
  res.status(500).json({ message: "Internal server error" });
};

export default errorHandler;
