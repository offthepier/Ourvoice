interface IEventParams {
  body?: any;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "OPTION";
  path?: string;
  queryStringObject?: any;
  pathParametersObject?: any;
  stageVariables?: any;
  claims?: any;
}

const generateEvent = ({
  body,
  method = "GET",
  path = "",
  queryStringObject,
  pathParametersObject,
  stageVariables = null,
  claims,
}: IEventParams) => {
  const request = {
    body: body ? JSON.stringify(body) : null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: method,
    isBase64Encoded: false,
    path,
    pathParameters: pathParametersObject || null,
    queryStringParameters: queryStringObject || null,
    multiValueQueryStringParameters: null,
    stageVariables,
    requestContext: {
      authorizer: {
        claims: claims,
      },
      accountId: "",
      apiId: "",
      httpMethod: method,
      identity: {
        accessKey: "",
        accountId: "",
        apiKey: "",
        apiKeyId: "",
        caller: "",
        cognitoAuthenticationProvider: "",
        cognitoAuthenticationType: "",
        cognitoIdentityId: "",
        cognitoIdentityPoolId: "",
        principalOrgId: "",
        sourceIp: "",
        user: "",
        userAgent: "",
        userArn: "",
      },
      path,
      stage: "",
      requestId: "",
      requestTimeEpoch: 3,
      resourceId: "",
      resourcePath: "",
    },
    resource: "",
  };
  return request;
};

export { generateEvent };
