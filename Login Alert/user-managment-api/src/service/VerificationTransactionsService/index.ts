import createDynamoDBClient from "../../config/db";
import VerificationTransactionsService from "./VerificationTransactionsService.service";

const VERIFICATION_TABLE =
  process.env.VERIFICATION_TABLE || "VerificationRequests";

const verificationTransactionsService = new VerificationTransactionsService(
  createDynamoDBClient(),
  VERIFICATION_TABLE
);

export default verificationTransactionsService;
