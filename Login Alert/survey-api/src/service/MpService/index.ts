import createDynamoDBClient from "../../config/db";
import MpService from "./mpStore.service";

const MP_TABLE = process.env.MP_TABLE || "invitemp";

const mpService = new MpService(createDynamoDBClient(), MP_TABLE);

export default mpService;
