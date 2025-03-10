import API from "../API";
import ProfileAPI from "../ProfileAPI";
import IUpdateProfile from "@/types/IUpdateProfile";
import IProfilePic from "@/types/IProfilePic";
import { USER_ENDPOINTS } from "@/constants/Path";

const getUserDetails = async () => {
  try {
    return await (
      await ProfileAPI.get(`${USER_ENDPOINTS.GET_USER_DETAILS}`)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const getUserPublicProfile = async (userId: string) => {
  try {
    return await (
      await ProfileAPI.get(`${USER_ENDPOINTS.GET_USER_PUBLIC_PROFILE}`, {
        params: {
          userId,
        },
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const updateUserdetails = async (data: IUpdateProfile) => {
  return await (
    await ProfileAPI.put(`${USER_ENDPOINTS.GET_USER_DETAILS}`, data)
  ).data;
};

//update profile pic

const updateUserPic = async (data: IProfilePic) => {
  try {
    return await (
      await ProfileAPI.put(`${USER_ENDPOINTS.GET_USER_PROFILE_PICTURE}`, data)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

//get user posts
const getUserPosts = async (
  userId: string,
  limit: number,
  lastEvaluatedKey?: Record<string, unknown>
) => {
  try {
    return await (
      await API.post(`${USER_ENDPOINTS.GET_USER_POSTS}/latest`, {
        userId: userId,
        limit: limit,
        lastEvaluatedKey: lastEvaluatedKey,
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const getUserProfileDetails = async () => {
  try {
    return await (
      await ProfileAPI.get(`${USER_ENDPOINTS.GET_USER_PROFILE_PICTURE}`)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const UserProfileService = {
  getUserPosts,
  getUserDetails,
  updateUserdetails,
  updateUserPic,
  getUserProfileDetails,
  getUserPublicProfile,
  //   create,
};

export default UserProfileService;
