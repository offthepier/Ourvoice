import { validate } from "../../src/functions/postSignupController";
import { userService } from "../../src/service/PostSignup";
import ausGeoLocationService from "../../src/service/AusGeolocationService";
import { addUserToGroup } from "../../src/utils/addUserGroup";
import adminMPService from "../../src/service/MpService";
import adminService from "../../src/service/AdminService";

jest.mock("../../src/service/PostSignup");
jest.mock("../../src/service/AusGeolocationService");
jest.mock("../../src/utils/addUserGroup");
jest.mock("../../src/service/MpService");
jest.mock("../../src/service/AdminService");

describe("validate", () => {
  const mockedCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully create a user after confirmation", async () => {
    const event = {
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          "custom:First_Name": "John",
          "custom:Last_Name": "Doe",
          email: "john.doe@example.com",
          "custom:Country": "Australia",
          "custom:Suburb": "Test Suburb",
          "custom:Postal_Code": "1234",
        },
      },
      userPoolId: "test-user-pool-id",
      userName: "test-user-name",
    };

    const locationDetails = {
      federalElectorate: "Test Federal",
      localElectorate: "Test Local",
      stateElectorate: "Test State",
    };

    (ausGeoLocationService.getByKeys as jest.Mock).mockResolvedValue(
      locationDetails
    );
    (adminMPService.getMPInviteByEmail as jest.Mock).mockResolvedValue(null);
    (adminService.getAdminByEmail as jest.Mock).mockResolvedValue(null);
    (userService.createUser as jest.Mock).mockResolvedValue({});

    await validate(event, {} as any, mockedCallback);

    expect(ausGeoLocationService.getByKeys).toHaveBeenCalledWith({
      suburb: event.request.userAttributes["custom:Suburb"],
      postcode: event.request.userAttributes["custom:Postal_Code"],
    });

    expect(addUserToGroup).toHaveBeenCalledWith({
      userPoolId: event.userPoolId,
      username: event.userName,
      groupName: "CITIZEN",
    });

    expect(userService.createUser).toHaveBeenCalled();

    expect(mockedCallback).toHaveBeenCalledWith(null, event);
  });
});
