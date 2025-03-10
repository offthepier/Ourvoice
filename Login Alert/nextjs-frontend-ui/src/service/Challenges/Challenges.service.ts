import API from "../API";
import { CHALLENGES_ENDPOINTS } from "@/constants/Path";
const getChallenges = async () => {
  try {
    return await (
      await API.get(`${CHALLENGES_ENDPOINTS.GET_CHALLENGES}`)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const getTopChallenges = async () => {
  try {
    return await (
      await API.get(`${CHALLENGES_ENDPOINTS.GET_TOP_CHALLENGES}`)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const ChallengesService = {
  getChallenges,
  getTopChallenges,
};

export default ChallengesService;
