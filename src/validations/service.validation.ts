type ServiceProps = {
  description: string;
  estimatedPrice: number;
  providerId: string;
};
export const validate_new_service = async ({
  description,
  estimatedPrice,
  providerId,
}: ServiceProps) => {
  if (!description) {
    throw new Error("Please Enter provider description");
  } else if (!estimatedPrice) {
    throw new Error("Please Enter provider estimatedPrice");
  } else if (!providerId) {
    throw new Error("Please Send provider providerId");
  } else {
    return true;
  }
};
