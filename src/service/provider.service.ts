import prisma from "../../prisma/prisma";

type ServiceProps = {
  description: string;
  estimatedPrice: number;
  providerId: string;
  id: string;
  additionalInfo: string;
  AdditionalFees: any[];
  isComplete: boolean;
  media: string
};

export const saveService = async ({
  estimatedPrice,
  description,
  id,
  additionalInfo,
  AdditionalFees,
  isComplete,
  media
}: ServiceProps) => {
  const responses = await prisma.providerOnService.update({
    where: { id: id },
    data: {
      estimatedPrice,
      isComplete,
      description,
      additionalInfo,
      media,
      AdditionalFees: {
        upsert: AdditionalFees.map((fee) => ({
          where: { id: fee.id || undefined },
          create: {
            fees: fee.fees,
            title: fee.title,
          },
          update: {
            fees: fee.fees,
            title: fee.title,
          },
        })),
      },
    },
  });
  return responses;
};

export const getServiceByProvider = async (id: string) => {
  const responses = await prisma.service.findMany({ where: { id: id } });
  return responses;
};
export const getServiceById = async (id: string) => {
  const responses = await prisma.service.findUnique({ where: { id: id } });
  return responses;
};

export const getAllServices = async () => {
  const responses = await prisma.service.findMany();
  return responses;
};
export const deleteServiceById = async (id: string, userId: string) => {
  const responses = await prisma.service.delete({
    where: { id: id },
  });
  if (!responses) {
    throw new Error("Service not found");
  }
  return responses;
};

export const updateServiceById = async (
  id: string,
  userId: string,
  title: string,
  description: string,
  price: number
) => {
  const responses = await prisma.service.update({
    where: { id: id },
    data: {
      title,
      description,
    },
  });
  if (!responses) {
    throw new Error("Service not found");
  }
  return responses;
};

type providerProps = {
  companyName: string;
  companyBio: string;
  companyLogo: string;
  companyEmail: string;
  files: string;
  userId: string;
};

export const createProvider = async ({
  companyName,
  companyBio,
  companyLogo,
  companyEmail,
  files,
  userId,
}: providerProps) => {
  const responses = await prisma.provider.create({
    data: {
      companyName,
      companyBio,
      companyLogo,
      email: companyEmail,
      files,
      userId,
    },
  });
  if (!responses) {
    throw new Error("Provider not created");
  } else {
    return responses;
  }
};

type serviceProps = {
  servicesData: any[];
  provider: any;
};

export const createServiceData = async ({
  servicesData,
  provider,
}: serviceProps) => {
  const responses = await Promise.all(
    servicesData.map(async (service) => {
      const serviceId: string = service.serviceId;
      const createdService = await prisma.providerOnService.create({
        data: {
          serviceId: serviceId,
          providerId: provider.id,
        },
      });
      return createdService;
    })
  );

  if (!responses || responses.length === 0) {
    throw new Error("Service not created");
  }

  return responses;
};
