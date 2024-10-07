import { NextFunction, Request, Response } from "express";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).token.role;
    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: Insufficient permissions" });
    }
    next();
  };
};
