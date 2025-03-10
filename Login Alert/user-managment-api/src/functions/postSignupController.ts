import { Context, Callback } from "aws-lambda";
import { userService } from "src/service/PostSignup";
import { v4 as uuidv4 } from "uuid";
import ausGeoLocationService from "src/service/AusGeolocationService";
import { addUserToGroup } from "src/utils/addUserGroup";
import adminMPService from "src/service/MpService";
import adminService from "src/service/AdminService";
import { VERIFICATION_STATUS } from "src/constants/verificationStatus";
import { SUBSCRIPTION_STATUS } from "src/constants/emailSubscription";
export const validate = async (
  event: any,
  _context: Context,
  callback: Callback
) => {
  // Locally Test
  console.log("_____________Came Here____________", event);
  const firstName = event.request.userAttributes["custom:First_Name"] as string;
  const lastName = event.request.userAttributes["custom:Last_Name"] as string;
  const email = event.request.userAttributes["email"] as string;
  const country = event.request.userAttributes["custom:Country"] as string;
  const suburb = event.request.userAttributes["custom:Suburb"] as string;
  const postcode = event.request.userAttributes["custom:Postal_Code"] as string;

  //PreConditon for the User GroupName
  const userPoolId = event.userPoolId;
  const username = event.userName;
  let groupName: string;

  // let token = event.request.userAttributes["custom:refToken"] as string;

  const cognitoEmail = event.request.userAttributes["email"] as string;

  const locationDetails = await ausGeoLocationService.getByKeys({
    suburb: event.request.userAttributes["custom:Suburb"] as string,
    postcode: event.request.userAttributes["custom:Postal_Code"] as string,
  });

  try {
    if (
      event.request.userAttributes.email &&
      event.triggerSource === "PostConfirmation_ConfirmSignUp"
    ) {
      //TODOD - Role Mapping

      const result = await adminMPService.getMPInviteByEmail(cognitoEmail);
      console.log(result, "result");

      //adminService
      const admin = await adminService.getAdminByEmail(cognitoEmail);
      console.log(admin, "adminUser");

      if (result) {
        groupName = "MP";
      } else if (admin) {
        groupName = "ADMIN";
      } else {
        groupName = "CITIZEN";
      }
      await addUserToGroup({ userPoolId, username, groupName });

      //Store the user attributes
      await userService.createUser({
        id: uuidv4(),
        firstName: firstName,
        email: email,
        lastName: lastName,
        searchableName:
          firstName?.toLowerCase() + " " + lastName?.toLowerCase(),
        searchVisibility: "PUBLIC",
        geoLocation: {
          country: country,
          postCode: postcode,
          suburb: suburb,
        },
        electorate: {
          federalElectorate: locationDetails.federalElectorate,
          localElectorate: locationDetails.localElectorate,
          stateElectorate: locationDetails.stateElectorate,
        },
        federalElectorate: locationDetails.federalElectorate,
        localElectorate: locationDetails.localElectorate,
        stateElectorate: locationDetails.stateElectorate,
        role: groupName,
        score: 0,
        dob: "",
        imageUrl: "",
        gender: "",
        phoneNumber: "",
        street: "",
        intro: "",
        interests: [],
        verificationStatus: VERIFICATION_STATUS.INCOMPLETE,
        emailSubscription: SUBSCRIPTION_STATUS.ACTIVE,
      });

      callback(null, event);
    } else {
      callback(null, event);
    }
  } catch (error) {
    callback(error, event);
  }
};
