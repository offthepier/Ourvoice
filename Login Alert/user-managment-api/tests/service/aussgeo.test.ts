import { DocumentClient } from "aws-sdk/clients/dynamodb";
import AusGeoCodeService from "../../src/service/AusGeolocationService/ausGeoCode.service";
import AusGeoCode from "../../src/models/AusGeoCode";

// Mock the DocumentClient
jest.mock("aws-sdk/clients/dynamodb", () => {
  return {
    DocumentClient: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn(),
      };
    }),
  };
});

describe("AusGeoCodeService", () => {
  const tableName = "aus_geocodes";
  let docClient: DocumentClient;
  let ausGeoCodeService: AusGeoCodeService;

  beforeEach(() => {
    docClient = new DocumentClient();
    ausGeoCodeService = new AusGeoCodeService(docClient, tableName);
    jest.clearAllMocks();
  });

  test("should return AusGeoCode object when getByKeys is called with valid data", async () => {
    const data: AusGeoCode = {
      postcode: "3000",
      suburb: "Melbourne",
    };

    const expectedItem = {
      Postcode: "3000",
      Suburb: "MELBOURNE",
      "Federal Electorate": "Melbourne",
      "State Electorate": "Melbourne",
      "Local Government Area (Council)": "Melbourne",
    };

    // Mock the get method to resolve with the expectedItem
    docClient.get = jest.fn().mockReturnValue({
      promise: () => Promise.resolve({ Item: expectedItem }),
    });

    const result = await ausGeoCodeService.getByKeys(data);

    // Verify that the get method was called with the correct parameters
    expect(docClient.get).toHaveBeenCalledWith({
      TableName: tableName,
      Key: {
        Suburb: data.suburb.toUpperCase(),
        Postcode: data.postcode,
      },
    });

    // Verify that the result matches the expected object
    expect(result).toEqual({
      postcode: expectedItem.Postcode,
      suburb: expectedItem.Suburb,
      federalElectorate: expectedItem["Federal Electorate"],
      stateElectorate: expectedItem["State Electorate"],
      localElectorate: expectedItem["Local Government Area (Council)"],
    });
  });
});
