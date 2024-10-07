import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

export const selectBaseServices = async (req: Request, res: Response) => {
  const services = await prisma.service.findMany();
  if (!services) {
    return res.status(404).json({ message: "No services found" });
  }
  return res.status(200).json(services);
};

export const createBaseService = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const duplicate: any = await prisma.service.findMany({
      where: { title: title },
    });
    if (duplicate.length > 0) {
      return res.status(400).json({ message: "Service already exists" });
    }
    const service = await prisma.service.create({
      data: { title, description },
    });
    if (!service) {
      return res.status(400).json({ message: "Failed to create service" });
    }
    return res.status(201).json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const SelectProviderService = async (req: Request, res: Response) => {
  try {
    const user = (req as any).token;
    const services = await prisma.providerOnService.findMany({
      where: {
        provider: {
          userId: user.id,
        },
      },
      include: {
        provider: true,
        service: true
      }
    });
    if (!services) {
      return res.status(404).json({ message: "No services found" });
    }
    return res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const SelectProvidersByService = async(req:Request,res:Response)=>{
  try {
    const {id}=req.params;
    const services = await prisma.providerOnService.findMany({
      where: {
        serviceId: id
      },
      include: {
        provider: {
          include: {
            user: true
          }
        }
      }
    })
    if(!services || services.length == 0){
      return res.status(404).json({message:"No providers found for this service"})
    }
    return res.status(200).json(services);
    
  } catch (error:any) {
    res.status(500).json({message: error.message})
    
  }
}
