import ProfileAPI from "../ProfileAPI";
import IAdmin from "./Admin.interface";
import { MP_ENDPOINTS } from "@/constants/Path";
const createNewMP = async (data: IAdmin) => {
  console.log(data);
  try {
    return await (
      await ProfileAPI.post(`${MP_ENDPOINTS.CREATE_NEW_MP}`, data)
    ).data;
  } catch (e: any) {
    console.log(e.response.data);
  }
};

const createNewMPBulk = async (fileId: string) => {
  try {
    return await (
      await ProfileAPI.post(`${MP_ENDPOINTS.CREATE_BULK_MP}`, { fileId })
    ).data;
  } catch (e: any) {
    console.log(e.response.data);
  }
};

const AdminService = {
  createNewMP,
  createNewMPBulk,
  //   create,
};

export default AdminService;
