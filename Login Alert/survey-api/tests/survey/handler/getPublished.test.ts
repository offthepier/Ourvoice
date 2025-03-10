import { handler } from "../../../src/functions/response/getSurveyCountFunction";
import { generateEvent } from "../../utils/eventGenerator";
import { StatusCodes } from "http-status-codes";
import surveyService from "../../../src/service/Survey";
jest.setTimeout(60000);

describe("Test getPublished Endpoint", function () {
  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "slimmortals.004@gmail.com",
        },
      }),
      context,
      {} as any
    );

    // console.log(result.body);
    expect(result.statusCode).toEqual(201);
  });

  it("Verifies error response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 6000,
    } as any;

    // Simulate error being thrown from surveyService.getPendingSurvey
    jest
      .spyOn(surveyService, "getMpPublishSurvey")
      .mockRejectedValue(new Error("Internal Server Error"));

    const result = await handler(
      generateEvent({
        claims: {
          email: "slimmortals.004@gmail.com",
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);

    // Restore the original function after the test
    jest.spyOn(surveyService, "getMpPublishSurvey").mockRestore();
  });
});
