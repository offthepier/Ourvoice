import createDynamoDBClient from "../../config/db";
import VotingService from "./voting.service";

const VOTES_TABLE = process.env.VOTES_TABLE || "Votes";

const votingService = new VotingService(createDynamoDBClient(), VOTES_TABLE);

export default votingService;
