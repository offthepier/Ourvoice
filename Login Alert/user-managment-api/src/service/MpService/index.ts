import createDynamoDBClient from "../../config/db";
import MPSaveUser from "./mpStore.service";

const MP_TABLE = process.env.MP_TABLE || "invitemp";

const adminMPService = new MPSaveUser(createDynamoDBClient(), MP_TABLE);

export default adminMPService;
