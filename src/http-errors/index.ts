const codes = {
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Payload Too Large',
  '414': 'URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': "I'm a Teapot",
  '421': 'Misdirected Request',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '425': 'Too Early',
  '426': 'Upgrade Required',
  '428': 'Precondition Required',
  '429': 'Too Many Requests',
  '431': 'Request Header Fields Too Large',
  '451': 'Unavailable For Legal Reasons',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
  '506': 'Variant Also Negotiates',
  '507': 'Insufficient Storage',
  '508': 'Loop Detected',
  '509': 'Bandwidth Limit Exceeded',
  '510': 'Not Extended',
  '511': 'Network Authentication Required',
} as const;

export enum ErrorNames {
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  PaymentRequired = 'PaymentRequired',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  MethodNotAllowed = 'MethodNotAllowed',
  NotAcceptable = 'NotAcceptable',
  ProxyAuthenticationRequired = 'ProxyAuthenticationRequired',
  RequestTimeout = 'RequestTimeout',
  Conflict = 'Conflict',
  Gone = 'Gone',
  LengthRequired = 'LengthRequired',
  PreconditionFailed = 'PreconditionFailed',
  PayloadTooLarge = 'PayloadTooLarge',
  URITooLong = 'URITooLong',
  UnsupportedMediaType = 'UnsupportedMediaType',
  RangeNotSatisfiable = 'RangeNotSatisfiable',
  ExpectationFailed = 'ExpectationFailed',
  ImaTeapot = 'ImaTeapot',
  MisdirectedRequest = 'MisdirectedRequest',
  UnprocessableEntity = 'UnprocessableEntity',
  Locked = 'Locked',
  FailedDependency = 'FailedDependency',
  UnorderedCollection = 'UnorderedCollection',
  UpgradeRequired = 'UpgradeRequired',
  PreconditionRequired = 'PreconditionRequired',
  TooManyRequests = 'TooManyRequests',
  RequestHeaderFieldsTooLarge = 'RequestHeaderFieldsTooLarge',
  UnavailableForLegalReasons = 'UnavailableForLegalReasons',
  InternalServerError = 'InternalServerError',
  NotImplemented = 'NotImplemented',
  BadGateway = 'BadGateway',
  ServiceUnavailable = 'ServiceUnavailable',
  GatewayTimeout = 'GatewayTimeout',
  HTTPVersionNotSupported = 'HTTPVersionNotSupported',
  VariantAlsoNegotiates = 'VariantAlsoNegotiates',
  InsufficientStorage = 'InsufficientStorage',
  LoopDetected = 'LoopDetected',
  BandwidthLimitExceeded = 'BandwidthLimitExceeded',
  NotExtended = 'NotExtended',
  NetworkAuthenticationRequired = 'NetworkAuthenticationRequired',
}

//

export type HttpErrInput = {
  msg: string;
  data?: unknown;
  cause?: any;
};

export class HttpError extends Error {
  public code: number;
  public name: keyof typeof ErrorNames;

  public data?: unknown;

  constructor(
    name: keyof typeof ErrorNames,
    code: number,
    { msg, data, cause }: HttpErrInput,
  ) {
    super(msg, { cause });
    this.name = name;
    this.code = code;
    this.data = data;
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      data: this.data,
    };
  }

  static isHttpError(e: unknown): e is HttpError {
    return e instanceof HttpError;
  }

  static causedByHttpError(e: Error): e is CausedByHttpError {
    return this.isHttpError(e.cause);
  }
}

export interface CausedByHttpError extends Error {
  cause: HttpError;
}

type ErrorCreator = (input: HttpErrInput) => HttpError;

type Errors = {
  [errorName in ErrorNames]: ErrorCreator;
};

const createErrorClass = (code: number, name: keyof typeof ErrorNames) => {
  return (input: HttpErrInput) => {
    return new HttpError(name, code, input);
  };
};

export const HttpErrors: Errors = Object.keys(codes).reduce<Errors>(
  (errors: Errors, code: keyof typeof codes) => {
    const errorType = codes[code].replace(/\W/g, '') as keyof typeof ErrorNames;

    errors[errorType] = createErrorClass(parseInt(code, 10), errorType);

    return errors;
  },
  {} as Errors,
);
