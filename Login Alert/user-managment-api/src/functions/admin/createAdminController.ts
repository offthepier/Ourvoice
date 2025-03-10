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
import middify from "src/core/middify";
import formatJSONResponse from "src/core/formatJsonResponse";
import IAdminBody from "src/dtos/createAdminDto";
import adminService from "src/service/AdminService";
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & IAdminBody,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { email, firstName, lastName } = event.body;

    try {
      const admin = await adminService.createAdmin({
        id: uuidv4(),
        email: email,
        firstName: firstName,
        lastName: lastName,
      });

      return formatJSONResponse(StatusCodes.CREATED, { token: `${admin.id}` });
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
