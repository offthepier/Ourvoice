/**
 * Module  -  Add MP
 * Date -  28/11/2022
 */
import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import CreateMP from "../dtos/createMPDto";
import adminMPService from "src/service/MpService";
import adminService from "src/service/AdminService";
import { StatusCodes } from "http-status-codes";
import { runEmailJob } from "src/service/EmailService/Email.service";
import { MP_INVITE } from "src/constants/emailTemplates";
import { capitalizeFirstLetter } from "src/utils/setCapitalLetter";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & CreateMP,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { email, fullName, electorateType, electorateName } = event.body;

    const { authorizer } = event.requestContext;
    const adminEmail = authorizer?.claims?.email;

    try {
      const adminExists = await adminService.getAdminByEmail(adminEmail);
      if (!adminExists) {
        console.log("user not found", adminEmail);
        return formatJSONResponse(StatusCodes.BAD_REQUEST, "user not found");
      }
      const UserExists = await adminMPService.getMPInviteByEmail(email);
      if (UserExists) {
        console.log("user Already exists", UserExists.email);
        return formatJSONResponse(StatusCodes.CONFLICT, "Already exists");
      }

      const capitalizedFullName = fullName
        .split(" ")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");
      // Split fullName by spaces, capitalize the first letter of each word, then join them back together

      const newMember = await adminMPService.createMPUser({
        id: uuidv4(),
        email: email,
        fullName: capitalizedFullName,
        electorateType: electorateType,
        electorateName: electorateName,
      });

      if (newMember) {
        await runEmailJob({
          toAddresses: [email],
          message: {
            subject: MP_INVITE.subject,
            body: `${capitalizedFullName} invitation for registration`,
          },
        });
      }

      return formatJSONResponse(StatusCodes.CREATED, {
        message: StatusCodes.CREATED,
        newMP: newMember,
      });
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err.messsage);
    }
  }
);
