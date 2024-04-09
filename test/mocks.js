/** @typedef {import("aws-lambda").Context} Context */
/** @typedef {import("@architect/functions/types/http").HttpRequest} ArcRequest */
/** @typedef {ArcRequest & {routeParams: Record<string, string>}} ObeliskArcRequest */

// create mock API Gateway event and Context to invoke lambdaHandler

/** @type {Context} */
export const context = {
  awsRequestId: 'mock-aws-request-id',
  functionName: 'mock-function-name',
  functionVersion: 'mock-function-version',
  invokedFunctionArn: 'mock-invoked-function-arn',
  logGroupName: 'mock-log-group-name',
  logStreamName: 'mock-log-stream-name',
  memoryLimitInMB: '128',
  callbackWaitsForEmptyEventLoop: true,
  getRemainingTimeInMillis: () => 1000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
}

/** @type {ArcRequest} */
const req = {
  version: '2.0',
  path: '/my/path',
  headers: {
    header1: 'value1',
    header2: 'value1,value2',
  },
  queryStringParameters: {
    parameter1: 'value1,value2',
    parameter2: 'value',
  },
  pathParameters: { parameter1: 'value1' },
  method: 'GET',
  httpMethod: 'GET',
  isBase64Encoded: false,
  params: {},
  query: {},
  body: null,
  rawBody: '',
  resource: '/{proxy+}',
  session: {},
}

/** @type {ObeliskArcRequest} */
export const rootRequest = {
  ...req,
  path: '/',
  headers: {},
  queryStringParameters: {},
  pathParameters: {},
  routeParams: {},
}

/** @type {ObeliskArcRequest} */
export const apiReq = {
  ...req,
  path: '/api/things/near/123-456/radius/789',
  routeParams: {},
}
