import ProfileAPI from "../ProfileAPI";
import IKYCVerification from "./KYCData.interface";
import { KYC_VERIFICATION } from "@/constants/Path";

const verifyUser = async (data: IKYCVerification) => {
  try {
    return await (
      await ProfileAPI.post(`${KYC_VERIFICATION.USER_VERIFY}`, data)
    ).data;
  } catch (e) {
    throw e;
  }
};

const KycVerificationService = {
  verifyUser,
};

export default KycVerificationService;
