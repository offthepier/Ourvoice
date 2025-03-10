import { validate } from "../../src/functions/preSignUpUserValidate";
import ausGeoLocationService from "../../src/service/AusGeolocationService";
import * as validators from "../../src/helpers/validators";

jest.mock("../../src/helpers/validators", () => ({
  PreSignUpValidation: {
    validate: jest.fn(),
  },
}));

jest.mock("../../src/service/AusGeolocationService");

describe("validate", () => {
  const mockedCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success when validation passes", async () => {
    const event = {
      request: {
        userAttributes: {
          "custom:Postal_Code": "1234",
          "custom:Suburb": "Test Suburb",
        },
      },
    };

    (
      validators.PreSignUpValidation.validate as jest.Mock
    ).mockResolvedValueOnce(true as any);
    (ausGeoLocationService.getByKeys as jest.Mock).mockResolvedValueOnce({});

    await validate(event, {} as any, mockedCallback);
    expect(mockedCallback).toHaveBeenCalledWith(null, event);
  });

  it("should return error when attribute validation fails", async () => {
    const event = {
      request: {
        userAttributes: {
          "custom:Postal_Code": "1234",
          "custom:Suburb": "Test Suburb",
        },
      },
    };

    (
      validators.PreSignUpValidation.validate as jest.Mock
    ).mockRejectedValueOnce(new Error("Validation Error"));

    await validate(event, {} as any, mockedCallback);
    expect(mockedCallback).toHaveBeenCalledWith(expect.any(Error), event);
  });

  it("should return error when location data validation fails", async () => {
    const event = {
      request: {
        userAttributes: {
          "custom:Postal_Code": "1234",
          "custom:Suburb": "Test Suburb",
        },
      },
    };

    (
      validators.PreSignUpValidation.validate as jest.Mock
    ).mockResolvedValueOnce(true as any);
    (ausGeoLocationService.getByKeys as jest.Mock).mockResolvedValueOnce(null);

    await validate(event, {} as any, mockedCallback);
    expect(mockedCallback).toHaveBeenCalledWith(expect.any(Error), event);
  });
});
