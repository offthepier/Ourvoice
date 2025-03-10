/**
 * Module  -  MP Bulk Invite using CSV
 * Date -  02/03/2023
 */
import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import adminService from "src/service/AdminService";
import { StatusCodes } from "http-status-codes";
import { S3 } from "aws-sdk";
import { requestValidator } from "src/helpers/RequestValidator";
import { MpBulkUploadRequestValidator } from "src/helpers/validators";
import IMpBulkUploadBody from "src/dtos/mpBulkUploadDto";
import IMP from "src/models/InvitedMp";
import { v4 as uuidv4 } from "uuid";
import adminMPService from "src/service/MpService";
import { runEmailJob } from "src/service/EmailService/Email.service";
import { MP_INVITE } from "src/constants/emailTemplates";
import { validateEmail } from "src/utils/emailValidate";

//parse csv using this
const csv = require("@fast-csv/parse");

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & IMpBulkUploadBody,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    //destruct event body
    const { fileId } = event.body;

    // your bucket name
    const bucketName = process.env.AWS_S3_FILE_UPLOAD_BUCKET_NAME;

    // creating instance of AWS S3 management object
    const s3 = new S3();

    //authorizer object
    const { authorizer } = event.requestContext;

    //check of user is an admin
    const adminExists = await adminService.getAdminByEmail(
      authorizer?.claims?.email.trim()
    );

    if (!adminExists) {
      return formatJSONResponse(
        StatusCodes.UNAUTHORIZED,
        "Action Not Allowed!"
      );
    }

    try {
      const output = s3
        .getObject({
          Bucket: bucketName,
          // Key is file name in AWS terminology
          Key: fileId,
        })
        .createReadStream()
        .on("error", (error) => {
          console.log("Error Reading File ", error);
          return formatJSONResponse(StatusCodes.BAD_REQUEST, error.message);
        });

      let mpsList: IMP[] = [];

      //Read from csv and write to db and send emails
      let parserFcn = new Promise((resolve, reject) => {
        csv
          .parseStream(output, { headers: true })
          .on("data", function (data) {
            //Reading from csv
            if (
              validateEmail(data["Email"]) &&
              data["Name"]?.length > 1 &&
              data["Electorate Type"]?.length > 1 &&
              data["Electorate Name"]?.length > 1
            ) {
              mpsList.push({
                id: uuidv4(),
                email: data["Email"],
                fullName: data["Name"],
                electorateType: String(
                  data["Electorate Type"]
                ).toUpperCase(),
                electorateName: data["Electorate Name"],
              });
            }
          })
          .on("end", async function () {
            //CSV Processing Success
            console.log("CSV Processing Success!");

            //Save to dynamodb
            const data = await adminMPService.createMPUserBulk(mpsList);
            if (data) {
              //Send Emails
              console.log("Processed following items");
              console.log(data);
              // *This should be changed to ses template bulk option later
              for (const mps of mpsList) {
                await runEmailJob({
                  message: {
                    subject: MP_INVITE.subject,
                    body: `${mps.fullName} invitation for registration`,
                  },
                  toAddresses: [mps.email],
                });
              }

              resolve("done");
            } else reject("error");
          })
          .on("error", function (err) {
            console.log("Error Parsing CSV", err);
            reject(err);
          });
      });

      return Promise.resolve(parserFcn).then(() => {
        console.log("returning");
        return formatJSONResponse(StatusCodes.OK, {
          message: "MP Invitations send Successfully",
        });
      });
    } catch (e) {
      console.log(e);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, e.message);
    }
  }
).use(requestValidator({ body: MpBulkUploadRequestValidator }));
