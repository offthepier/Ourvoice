import createDynamoDBClient from "../../config/db";
import AusGeoLocationService from "./ausGeoCode.service";

const AUS_GEOCODES_TABLE = process.env.AUS_GEOCODES_TABLE || "aus_geocodes";

const ausGeoLocationService = new AusGeoLocationService(
  createDynamoDBClient(),
  AUS_GEOCODES_TABLE
);

export default ausGeoLocationService;
