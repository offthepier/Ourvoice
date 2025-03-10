import { handler } from "../../../src/functions/mp/getMpEmailFunction";
import { generateEvent } from "../../utils/eventGenerator";
import mpService from "../../../src/service/MpService";
import { StatusCodes } from "http-status-codes";

jest.mock("../../../src/service/MpService");
jest.setTimeout(50000);

describe("Test Get mp  Endpoint", function () {
  it("Verifies successful response", async () => {
    const mockEmail = "slimmortals.004@gmail.com";
    const mockResponse = {
      firstName: "John",
      lastName: "Doe",
      rank: 1,
      score: 100,
    };

    // Mock the getMPInviteByEmail function to return the mock response
    mpService.getMPInviteByEmail = jest.fn().mockResolvedValue(mockResponse);

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

    expect(mpService.getMPInviteByEmail).toHaveBeenCalledTimes(1);
    expect(mpService.getMPInviteByEmail).toHaveBeenCalledWith(mockEmail);
    expect(result.statusCode).toEqual(StatusCodes.OK);
    expect(JSON.parse(result.body)).toEqual(mockResponse);
  });

  it("User Notfound", async () => {
    mpService.getMPInviteByEmail = jest.fn().mockResolvedValue(null);
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "abc.004@gmail.com",
        },
        body: {
          limit: 10,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(404);
  });

  it("should return NOT_FOUND when an error occurs", async () => {
    const mockEmail = "error@example.com";
    const error = new Error("Error occurred");

    // Mock the getMPInviteByEmail function to throw an error
    mpService.getMPInviteByEmail = jest.fn().mockRejectedValue(error);

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

    expect(mpService.getMPInviteByEmail).toHaveBeenCalledTimes(1);
    expect(mpService.getMPInviteByEmail).toHaveBeenCalledWith(mockEmail);
    expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.body).toEqual(JSON.stringify(error));
  });
});
