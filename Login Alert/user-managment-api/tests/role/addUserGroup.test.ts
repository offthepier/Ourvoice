import { addUserToGroup } from "../../src/utils/addUserGroup";
import * as AWS from "aws-sdk";

const mockAdminAddUserToGroup = jest.fn();

// Mock the CognitoIdentityServiceProvider class
AWS.CognitoIdentityServiceProvider.prototype.adminAddUserToGroup =
  mockAdminAddUserToGroup;

describe("addUserToGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add user to group successfully", async () => {
    const userPoolId = "ap-southeast-2_sJm75qNri";
    const username = "rk1223@gmail.com";
    const groupName = "CITIZEN";

    // Mock the adminAddUserToGroup function to resolve successfully
    mockAdminAddUserToGroup.mockImplementation(() => {
      return {
        promise: () => Promise.resolve({ $response: {} }),
      };
    });

    const result = await addUserToGroup({ userPoolId, username, groupName });

    expect(mockAdminAddUserToGroup).toHaveBeenCalledWith({
      GroupName: groupName,
      UserPoolId: userPoolId,
      Username: username,
    });

    expect(result.$response).toBeDefined();
  });
});
