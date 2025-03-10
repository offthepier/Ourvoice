import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import * as AWS from "aws-sdk";
import axios from "axios";
import {
  DIGITAL_ID_API_CLIENT_ID,
  DIGITAL_ID_API_CLIENT_SECRET,
  DIGITAL_ID_API_URL,
  DIGITAL_ID_GRANT_TYPE,
  DIGITAL_ID_REDIRECT_URL,
} from "src/config/digitalID";
import VerifyUser from "src/dtos/verifyUser";
import { VERIFICATION_STATUS } from "src/constants/verificationStatus";
import { AWS_USER_POOL_ID } from "src/config/aws";
import userProfileService from "src/service/UserProfile";
import verificationTransactionsService from "src/service/VerificationTransactionsService";
import { parseJwt } from "src/utils/parseJWT";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & VerifyUser,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider();

    const { authorizer } = event.requestContext;
    console.log(authorizer?.claims?.email);

    const email = authorizer?.claims?.email;
    const { grantToken, transactionID } = event.body;

    const user = await userProfileService.getUserProfile(email);

    if (!user.dob) {
      return formatJSONResponse(
        StatusCodes.BAD_REQUEST,
        "User Verification Failed! No DOB for the user"
      );
    }

    try {
      const res = await axios.post(DIGITAL_ID_API_URL, null, {
        params: {
          redirect_uri: DIGITAL_ID_REDIRECT_URL,
          grant_type: DIGITAL_ID_GRANT_TYPE,
          code: grantToken,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${DIGITAL_ID_API_CLIENT_ID}:${DIGITAL_ID_API_CLIENT_SECRET}`
            ).toString("base64"),
        },
      });

      //parse jwt id token and get token data
      const tokenData = parseJwt(res.data?.["id_token"]);
      console.log(tokenData);
      console.log(user);

      if (
        tokenData?.["family_name"] &&
        tokenData?.["family_name"].toLowerCase() ==
          user.lastName.toLowerCase() &&
        tokenData?.["birthdate"] == user.dob
      ) {
        // console.log(parseJwt(res.data?.["id_token"]));
        //Update Cognito Attribute
        const attributeList = [
          {
            Name: "custom:verificationStatus",
            Value: VERIFICATION_STATUS.KYC_COMPLETE,
          },
        ];

        const params = {
          UserPoolId: AWS_USER_POOL_ID,
          Username: email,
          UserAttributes: attributeList,
        };

        try {
          await cognitoIdentityServiceProvider
            .adminUpdateUserAttributes(params)
            .promise();
        } catch (error) {
          return formatJSONResponse(StatusCodes.NOT_FOUND, error);
        }

        //Update DB Value
        await userProfileService.updateVerificationStatus(email);

        //Save transaction in DB
        await verificationTransactionsService.createVerificationTransaction({
          email: email,
          transactionId: transactionID,
        });
      } else {
        return formatJSONResponse(
          StatusCodes.BAD_REQUEST,
          "User Verification Failed!"
        );
      }
      return formatJSONResponse(StatusCodes.OK, "User Verified");
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err.message);
    }
  }
);
