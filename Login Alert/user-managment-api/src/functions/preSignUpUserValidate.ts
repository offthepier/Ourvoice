/*
  This Lambda function will run at cognito user preSignup event and 
  will validate custom attributes 
  and location data (postal code, suburb) 
*/

import { Callback, Context } from "aws-lambda";
import { PreSignUpValidation } from "src/helpers/validators";
import ausGeoLocationService from "src/service/AusGeolocationService";

export const validate = async (
  event: any,
  _context: Context,
  callback: Callback
) => {
  //log event details for debugging purposes
  console.log(event);

  //Validate User Attributes
  const validAttributes = await PreSignUpValidation.validate(
    event.request.userAttributes
  ).catch((err) => {
    // Return validation errors to Amazon Cognito
    return callback(err, event);
  });

  //Validate Suburb
  if (validAttributes) {
    //Validate if the location data is valid
    const geoData = await ausGeoLocationService.getByKeys({
      suburb: event.request.userAttributes["custom:Suburb"] as string,
      postcode: event.request.userAttributes["custom:Postal_Code"] as string,
    });

    if (geoData) {
      //Location Data is valid
      callback(null, event);
    } else {
      //Location Data is invalid
      let error = new Error("Invalid Location Data");
      callback(error, event);
    }
  } else {
    //Validation Failed
    let error = new Error("User Attributes Validation Failed");
    console.log(error);
    // Return error to Amazon Cognito
    callback(error, event);
  }
};

/*

Cognito event data shape

"request":{
   "userAttributes":{
      "custom:Postal_Code":"string",
      "custom:Last_Name":"string",
      "custom:Suburb":"string",
      "custom:Country":"string",
      "custom:First_Name":"string",
      "email":"string"
   },

*/
