import API from "../API";
import IPetitionData from "./IPetitionData.interface";
import { PETITION_ENDPOINT } from "@/constants/Path";
import { POST_TYPES } from "@/constants/PostTypes";
const getPetitions = async () => {
  try {
    return await (
      await API.get(`${PETITION_ENDPOINT.GET_PETITIONS}`)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const createNewPetition = async (data: IPetitionData) => {
  console.log(data);

  let reqObject: any = {};
  if (data.postType == POST_TYPES.PROPOSAL) {
    reqObject.title = data.title;
  }
  reqObject.postType = data.postType;
  reqObject.description = data.description;
  reqObject.tags = data.tags;
  reqObject.community = data.community;
  reqObject.images = data.images;
  reqObject.challenge = data.challenge;
  reqObject.challengeID = data.challengeID;

  try {
    return await (
      await API.post(`${PETITION_ENDPOINT.CREATE_NEW_PETITION}`, reqObject)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const updatePetition = async (data: IPetitionData) => {
  console.log(data);

  let reqObject: any = {};
  if (data.postType == POST_TYPES.PROPOSAL) {
    reqObject.title = data.title;
  }
  reqObject.postType = data.postType;
  reqObject.description = data.description;
  reqObject.tags = data.tags;
  reqObject.community = data.community;
  reqObject.images = data.images;
  reqObject.challenge = data.challenge;
  reqObject.challengeID = data.challengeID;
  reqObject.postId = data.postId;

  try {
    return await (
      await API.put(`${PETITION_ENDPOINT.UPDATE_PETITION}`, reqObject)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const PetitionService = {
  getPetitions,
  createNewPetition,
  updatePetition
};

export default PetitionService;
