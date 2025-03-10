import { handler } from "../../../src/functions/user/getUserProfileFunction";
import { generateEvent } from "../../utils/eventGenerator";
import userProfileService from "../../../src/service/UserProfile";
import { StatusCodes } from "http-status-codes";

jest.mock("../../../src/service/UserProfile");
jest.setTimeout(50000);

describe("Test UserProfile Endpoint", function () {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Verifies successful response", async () => {
    const mockEmail = "fuxyrawi@mailo.icu";
    const mockUserProfile = {
      firstName: "John",
      lastName: "Doe",
      rank: 1,
      score: 100,
    };

    userProfileService.getUserProfile = jest
      .fn()
      .mockResolvedValue(mockUserProfile);

    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: mockEmail,
        },
      }),
      context,
      {} as any
    );

    expect(userProfileService.getUserProfile).toHaveBeenCalledTimes(1);
    expect(userProfileService.getUserProfile).toHaveBeenCalledWith(mockEmail);
    expect(result.statusCode).toEqual(StatusCodes.OK);
    expect(JSON.parse(result.body)).toMatchObject(mockUserProfile);
  });

  it("User Notfound", async () => {
    const mockEmail = "abc.004@gmail.com";

    userProfileService.getUserProfile = jest.fn().mockResolvedValue(null);

    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: mockEmail,
        },
        body: {
          limit: 10,
        },
      }),
      context,
      {} as any
    );

    expect(userProfileService.getUserProfile).toHaveBeenCalledTimes(1);
    expect(userProfileService.getUserProfile).toHaveBeenCalledWith(mockEmail);
    expect(result.statusCode).toEqual(404);
  });

  it("should return NOT_FOUND when an error occurs", async () => {
    const mockEmail = "error@example.com";
    const error = new Error("Error occurred");

    userProfileService.getUserProfile = jest.fn().mockRejectedValue(error);

    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: mockEmail,
        },
      }),
      context,
      {} as any
    );

    expect(userProfileService.getUserProfile).toHaveBeenCalledTimes(1);
    expect(userProfileService.getUserProfile).toHaveBeenCalledWith(mockEmail);
    expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.body).toEqual(JSON.stringify(error));
  });
});
