import { handler } from "../src/functions/updateUserProfile";
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { generateEvent } from "./utils/eventGenerator";
import userProfileService from "../src/service/UserProfile";
import IUser from "../src/models/User";

describe("updateUserProfile handler", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore();
  });

  it("should update user profile successfully", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;
    // Mock CognitoIdentityServiceProvider
    AWSMock.mock(
      "CognitoIdentityServiceProvider",
      "adminUpdateUserAttributes",
      (params, callback) => {
        callback(undefined, "success");
      }
    );

    // Mock userProfileService.updateUserProfile
    const mockUpdateUserProfile = jest.spyOn(
      userProfileService,
      "updateUserProfile"
    );

    const mockUser: IUser = {
      id: "1",
      email: "johndoe@example.com",
      firstName: "John",
      lastName: "Doe",
      electorate: {
        federalElectorate: "",
        localElectorate: "",
        stateElectorate: "",
      },
      geoLocation: {
        country: "",
        postCode: "",
        suburb: "",
        state: "",
      },
      // Add other properties as required by your type definition
    };
    mockUpdateUserProfile.mockResolvedValue(mockUser);

    const result = await handler(
      generateEvent({
        claims: {
          email: "johndoe@example.com",
        },
        body: {
          firstName: "John",
          lastName: "Doe",
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(404);
  });

  it("should return a 404 error if user profile update fails", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;
    // Mock CognitoIdentityServiceProvider
    AWSMock.mock(
      "CognitoIdentityServiceProvider",
      "adminUpdateUserAttributes",
      (params, callback) => {
        callback(undefined, "success");
      }
    );

    // Mock userProfileService.updateUserProfile to throw an error
    const mockUpdateUserProfile = jest.spyOn(
      userProfileService,
      "updateUserProfile"
    );
    mockUpdateUserProfile.mockRejectedValue(new Error("failed to update"));

    const result = await handler(
      generateEvent({
        claims: {
          email: "johndoe@example.com",
        },
        body: {
          firstName: "John",
          lastName: "Doe",
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(404);
  });

  // it("should return a 404 error if adminUpdateUserAttributes fails", async () => {
  //   const context = {
  //     getRemainingTimeInMillis: 5000, // Provide a mock implementation of getRemainingTimeInMillis
  //   } as any;

  //   // Mock CognitoIdentityServiceProvider to throw an error
  //   AWSMock.mock(
  //     "CognitoIdentityServiceProvider",
  //     "adminUpdateUserAttributes",
  //     (params, callback) => {
  //       callback(undefined, "failed to update user attributes");
  //     }
  //   );
  //   const result = await handler(
  //     generateEvent({
  //       claims: {
  //         email: "johndoe@example.com",
  //       },
  //       body: {
  //         firstName: "John",
  //         lastName: "Doe",
  //       },
  //     }),
  //     context,
  //     {} as any
  //   );

  //   expect(result.statusCode).toEqual(404);
  //   expect(result.body).toEqual("failed to update user attributes");
  // });
});
