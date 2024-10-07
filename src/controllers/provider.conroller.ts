import { Request, Response } from "express";
import {
  deleteServiceById,
  getAllServices,
  getServiceById,
  getServiceByProvider,
  saveService,
  updateServiceById,
} from "../service/provider.service";
import { validate_new_service } from "../validations/service.validation";
import prisma from "../../prisma/prisma";

export const AllProviders = async(req:Request,res:Response)=>{
  try {
    const providers = await prisma.provider.findMany()
    if(!providers || providers.length ==0){
      return res.status(404).json({message:"No providers found"})
    }
    return res.status(200).json(providers)
    
  } catch (error:any) {
    res.status(500).json({message: error.message})
    
  }
}

export const completeService = async (req: Request, res: Response) => {
  try {
    const user = (req as any).token;
    const { id } = req.params;
    const {
      description,
      price,
      providerId,
      additionalInfo,
      AdditionalFees,
      media
    } = req.body;
    if (user.role !== "PROVIDER") {
      return res
        .status(403)
        .json({ message: "You are not allowed to perfom this" });
    }
    await validate_new_service({
      description,
      estimatedPrice: price,
      providerId,
    });


    const service = await saveService({
      description,
      estimatedPrice: price,
      providerId,
      id,
      additionalInfo,
      AdditionalFees,
      isComplete: true,
      media
    });

    if (!service) {
      return res.status(400).json({ message: "Error creating service" });
    }
    return res
      .status(201)
      .json({ message: "Service complete successfully", service });
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (res: Response, req: Request) => {
  try {
    const user = (req as any).token;
    const { id } = req.params;
    if (user.role !== "PROVIDER") {
      return res.status(404).json({ message: "You are not allowed to perfom" });
    }
    const service = await getServiceById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const userId = user.userId;
    await deleteServiceById(id, userId);
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const user = (req as any).token;
    const { id } = req.params;
    const { title, description, price } = req.body;
    if (user.role !== "PROVIDER") {
      return res.status(404).json({ message: "You are not allowed to perfom" });
    }
    const service = await getServiceById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const userId = user.userId;
    const updatedService = await updateServiceById(
      id,
      userId,
      title,
      description,
      price
    );
    return res
      .status(200)
      .json({ message: "Service updated successfully", updatedService });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const services = async (req: Request, res: Response) => {
  try {
    const services = await getAllServices();
    if (!services || services.length == 0) {
      return res.status(404).json({ message: "No services found" });
    }
    return res.status(200).json({ message: "Services found", services });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const specific_provider_service = async (
  res: Response,
  req: Request
) => {
  try {
    const { id } = req.params;
    const services = await getServiceByProvider(id);
    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }
    return res.status(200).json({ services: services });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const single_service = async (res: Response, req: Request) => {
  try {
    const { id } = req.params;
    const service = await getServiceById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json({ service });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
