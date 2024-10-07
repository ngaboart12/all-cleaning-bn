import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

export const selectUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
