import { DocumentClient } from "aws-sdk/clients/dynamodb";
import User from "../../src/models/User";
import PostSignupSaveUser from "../../src/service/PostSignup/post.signup.saveUser.service";

describe("PostSignupSaveUser", () => {
  const tableName = "User";
  const putMock = jest.fn();

  const mockDocClient = {
    put: putMock,
  } as unknown as DocumentClient;

  const user: User = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    geoLocation: {
      country: "",
      postCode: "",
      suburb: "",
      state: "",
    },
    electorate: {
      federalElectorate: "",
      localElectorate: "",
      stateElectorate: "",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user successfully", async () => {
    const postSignupSaveUser = new PostSignupSaveUser(mockDocClient, tableName);

    putMock.mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const result = await postSignupSaveUser.createUser(user);

    expect(mockDocClient.put).toHaveBeenCalledTimes(1);
    expect(mockDocClient.put).toHaveBeenCalledWith({
      TableName: tableName,
      Item: user,
    });

    expect(result).toEqual(user);
  });
});
