var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/@notionhq/client/build/src/helpers.js
var require_helpers = __commonJS({
  "node_modules/@notionhq/client/build/src/helpers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isObject = exports2.pick = exports2.assertNever = void 0;
    function assertNever(value) {
      throw new Error(`Unexpected value should never occur: ${value}`);
    }
    exports2.assertNever = assertNever;
    function pick(base, keys) {
      const entries = keys.map((key) => [key, base === null || base === void 0 ? void 0 : base[key]]);
      return Object.fromEntries(entries);
    }
    exports2.pick = pick;
    function isObject(o) {
      return typeof o === "object" && o !== null;
    }
    exports2.isObject = isObject;
  }
});

// node_modules/@notionhq/client/build/src/logging.js
var require_logging = __commonJS({
  "node_modules/@notionhq/client/build/src/logging.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.logLevelSeverity = exports2.makeConsoleLogger = exports2.LogLevel = void 0;
    var helpers_1 = require_helpers();
    var LogLevel;
    (function(LogLevel2) {
      LogLevel2["DEBUG"] = "debug";
      LogLevel2["INFO"] = "info";
      LogLevel2["WARN"] = "warn";
      LogLevel2["ERROR"] = "error";
    })(LogLevel = exports2.LogLevel || (exports2.LogLevel = {}));
    function makeConsoleLogger(name) {
      return (level, message, extraInfo) => {
        console[level](`${name} ${level}:`, message, extraInfo);
      };
    }
    exports2.makeConsoleLogger = makeConsoleLogger;
    function logLevelSeverity(level) {
      switch (level) {
        case LogLevel.DEBUG:
          return 20;
        case LogLevel.INFO:
          return 40;
        case LogLevel.WARN:
          return 60;
        case LogLevel.ERROR:
          return 80;
        default:
          return helpers_1.assertNever(level);
      }
    }
    exports2.logLevelSeverity = logLevelSeverity;
  }
});

// node_modules/@notionhq/client/build/src/errors.js
var require_errors = __commonJS({
  "node_modules/@notionhq/client/build/src/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.buildRequestError = exports2.APIResponseError = exports2.UnknownHTTPResponseError = exports2.isHTTPResponseError = exports2.RequestTimeoutError = exports2.isNotionClientError = exports2.ClientErrorCode = exports2.APIErrorCode = void 0;
    var helpers_1 = require_helpers();
    var APIErrorCode;
    (function(APIErrorCode2) {
      APIErrorCode2["Unauthorized"] = "unauthorized";
      APIErrorCode2["RestrictedResource"] = "restricted_resource";
      APIErrorCode2["ObjectNotFound"] = "object_not_found";
      APIErrorCode2["RateLimited"] = "rate_limited";
      APIErrorCode2["InvalidJSON"] = "invalid_json";
      APIErrorCode2["InvalidRequestURL"] = "invalid_request_url";
      APIErrorCode2["InvalidRequest"] = "invalid_request";
      APIErrorCode2["ValidationError"] = "validation_error";
      APIErrorCode2["ConflictError"] = "conflict_error";
      APIErrorCode2["InternalServerError"] = "internal_server_error";
      APIErrorCode2["ServiceUnavailable"] = "service_unavailable";
    })(APIErrorCode = exports2.APIErrorCode || (exports2.APIErrorCode = {}));
    var ClientErrorCode;
    (function(ClientErrorCode2) {
      ClientErrorCode2["RequestTimeout"] = "notionhq_client_request_timeout";
      ClientErrorCode2["ResponseError"] = "notionhq_client_response_error";
    })(ClientErrorCode = exports2.ClientErrorCode || (exports2.ClientErrorCode = {}));
    var NotionClientErrorBase = class extends Error {
    };
    function isNotionClientError(error) {
      return helpers_1.isObject(error) && error instanceof NotionClientErrorBase;
    }
    exports2.isNotionClientError = isNotionClientError;
    function isNotionClientErrorWithCode(error, codes) {
      return isNotionClientError(error) && error.code in codes;
    }
    var RequestTimeoutError = class extends NotionClientErrorBase {
      constructor(message = "Request to Notion API has timed out") {
        super(message);
        this.code = ClientErrorCode.RequestTimeout;
        this.name = "RequestTimeoutError";
      }
      static isRequestTimeoutError(error) {
        return isNotionClientErrorWithCode(error, {
          [ClientErrorCode.RequestTimeout]: true
        });
      }
      static rejectAfterTimeout(promise, timeoutMS) {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new RequestTimeoutError());
          }, timeoutMS);
          promise.then(resolve).catch(reject).then(() => clearTimeout(timeoutId));
        });
      }
    };
    exports2.RequestTimeoutError = RequestTimeoutError;
    var HTTPResponseError = class extends NotionClientErrorBase {
      constructor(args) {
        super(args.message);
        this.name = "HTTPResponseError";
        const { code, status, headers, rawBodyText } = args;
        this.code = code;
        this.status = status;
        this.headers = headers;
        this.body = rawBodyText;
      }
    };
    var httpResponseErrorCodes = {
      [ClientErrorCode.ResponseError]: true,
      [APIErrorCode.Unauthorized]: true,
      [APIErrorCode.RestrictedResource]: true,
      [APIErrorCode.ObjectNotFound]: true,
      [APIErrorCode.RateLimited]: true,
      [APIErrorCode.InvalidJSON]: true,
      [APIErrorCode.InvalidRequestURL]: true,
      [APIErrorCode.InvalidRequest]: true,
      [APIErrorCode.ValidationError]: true,
      [APIErrorCode.ConflictError]: true,
      [APIErrorCode.InternalServerError]: true,
      [APIErrorCode.ServiceUnavailable]: true
    };
    function isHTTPResponseError(error) {
      if (!isNotionClientErrorWithCode(error, httpResponseErrorCodes)) {
        return false;
      }
      return true;
    }
    exports2.isHTTPResponseError = isHTTPResponseError;
    var UnknownHTTPResponseError = class extends HTTPResponseError {
      constructor(args) {
        var _a;
        super(__spreadProps(__spreadValues({}, args), {
          code: ClientErrorCode.ResponseError,
          message: (_a = args.message) !== null && _a !== void 0 ? _a : `Request to Notion API failed with status: ${args.status}`
        }));
        this.name = "UnknownHTTPResponseError";
      }
      static isUnknownHTTPResponseError(error) {
        return isNotionClientErrorWithCode(error, {
          [ClientErrorCode.ResponseError]: true
        });
      }
    };
    exports2.UnknownHTTPResponseError = UnknownHTTPResponseError;
    var apiErrorCodes = {
      [APIErrorCode.Unauthorized]: true,
      [APIErrorCode.RestrictedResource]: true,
      [APIErrorCode.ObjectNotFound]: true,
      [APIErrorCode.RateLimited]: true,
      [APIErrorCode.InvalidJSON]: true,
      [APIErrorCode.InvalidRequestURL]: true,
      [APIErrorCode.InvalidRequest]: true,
      [APIErrorCode.ValidationError]: true,
      [APIErrorCode.ConflictError]: true,
      [APIErrorCode.InternalServerError]: true,
      [APIErrorCode.ServiceUnavailable]: true
    };
    var APIResponseError = class extends HTTPResponseError {
      constructor() {
        super(...arguments);
        this.name = "APIResponseError";
      }
      static isAPIResponseError(error) {
        return isNotionClientErrorWithCode(error, apiErrorCodes);
      }
    };
    exports2.APIResponseError = APIResponseError;
    function buildRequestError(response, bodyText) {
      const apiErrorResponseBody = parseAPIErrorResponseBody(bodyText);
      if (apiErrorResponseBody !== void 0) {
        return new APIResponseError({
          code: apiErrorResponseBody.code,
          message: apiErrorResponseBody.message,
          headers: response.headers,
          status: response.status,
          rawBodyText: bodyText
        });
      }
      return new UnknownHTTPResponseError({
        message: void 0,
        headers: response.headers,
        status: response.status,
        rawBodyText: bodyText
      });
    }
    exports2.buildRequestError = buildRequestError;
    function parseAPIErrorResponseBody(body) {
      if (typeof body !== "string") {
        return;
      }
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (parseError) {
        return;
      }
      if (!helpers_1.isObject(parsed) || typeof parsed["message"] !== "string" || !isAPIErrorCode(parsed["code"])) {
        return;
      }
      return __spreadProps(__spreadValues({}, parsed), {
        code: parsed["code"],
        message: parsed["message"]
      });
    }
    function isAPIErrorCode(code) {
      return typeof code === "string" && code in apiErrorCodes;
    }
  }
});

// node_modules/@notionhq/client/build/src/api-endpoints.js
var require_api_endpoints = __commonJS({
  "node_modules/@notionhq/client/build/src/api-endpoints.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.search = exports2.usersList = exports2.usersRetrieve = exports2.pagesUpdate = exports2.pagesRetrieve = exports2.databasesCreate = exports2.pagesCreate = exports2.databasesRetrieve = exports2.databasesQuery = exports2.databasesList = exports2.blocksChildrenList = exports2.blocksChildrenAppend = exports2.blocksUpdate = exports2.blocksRetrieve = void 0;
    exports2.blocksRetrieve = {
      method: "get",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `blocks/${p.block_id}`
    };
    exports2.blocksUpdate = {
      method: "patch",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: [
        "paragraph",
        "heading_1",
        "heading_2",
        "heading_3",
        "bulleted_list_item",
        "numbered_list_item",
        "toggle",
        "to_do"
      ],
      path: (p) => `blocks/${p.block_id}`
    };
    exports2.blocksChildrenAppend = {
      method: "patch",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: ["children"],
      path: (p) => `blocks/${p.block_id}/children`
    };
    exports2.blocksChildrenList = {
      method: "get",
      pathParams: ["block_id"],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: (p) => `blocks/${p.block_id}/children`
    };
    exports2.databasesList = {
      method: "get",
      pathParams: [],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: () => `databases`
    };
    exports2.databasesQuery = {
      method: "post",
      pathParams: ["database_id"],
      queryParams: [],
      bodyParams: ["filter", "sorts", "start_cursor", "page_size"],
      path: (p) => `databases/${p.database_id}/query`
    };
    exports2.databasesRetrieve = {
      method: "get",
      pathParams: ["database_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `databases/${p.database_id}`
    };
    exports2.pagesCreate = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["parent", "properties", "children"],
      path: () => `pages`
    };
    exports2.databasesCreate = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["parent", "properties", "title"],
      path: () => `databases`
    };
    exports2.pagesRetrieve = {
      method: "get",
      pathParams: ["page_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `pages/${p.page_id}`
    };
    exports2.pagesUpdate = {
      method: "patch",
      pathParams: ["page_id"],
      queryParams: [],
      bodyParams: ["archived", "properties"],
      path: (p) => `pages/${p.page_id}`
    };
    exports2.usersRetrieve = {
      method: "get",
      pathParams: ["user_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `users/${p.user_id}`
    };
    exports2.usersList = {
      method: "get",
      pathParams: [],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: () => `users`
    };
    exports2.search = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["query", "sort", "filter", "start_cursor", "page_size"],
      path: () => `search`
    };
  }
});

// node_modules/node-fetch/lib/index.js
var require_lib = __commonJS({
  "node_modules/node-fetch/lib/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var Stream = _interopDefault(require("stream"));
    var http = _interopDefault(require("http"));
    var Url = _interopDefault(require("url"));
    var https = _interopDefault(require("https"));
    var zlib = _interopDefault(require("zlib"));
    var Readable = Stream.Readable;
    var BUFFER = Symbol("buffer");
    var TYPE = Symbol("type");
    var Blob = class {
      constructor() {
        this[TYPE] = "";
        const blobParts = arguments[0];
        const options = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
          const a = blobParts;
          const length = Number(a.length);
          for (let i = 0; i < length; i++) {
            const element = a[i];
            let buffer;
            if (element instanceof Buffer) {
              buffer = element;
            } else if (ArrayBuffer.isView(element)) {
              buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
            } else if (element instanceof ArrayBuffer) {
              buffer = Buffer.from(element);
            } else if (element instanceof Blob) {
              buffer = element[BUFFER];
            } else {
              buffer = Buffer.from(typeof element === "string" ? element : String(element));
            }
            size += buffer.length;
            buffers.push(buffer);
          }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options && options.type !== void 0 && String(options.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
          this[TYPE] = type;
        }
      }
      get size() {
        return this[BUFFER].length;
      }
      get type() {
        return this[TYPE];
      }
      text() {
        return Promise.resolve(this[BUFFER].toString());
      }
      arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
      }
      stream() {
        const readable = new Readable();
        readable._read = function() {
        };
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
      }
      toString() {
        return "[object Blob]";
      }
      slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === void 0) {
          relativeStart = 0;
        } else if (start < 0) {
          relativeStart = Math.max(size + start, 0);
        } else {
          relativeStart = Math.min(start, size);
        }
        if (end === void 0) {
          relativeEnd = size;
        } else if (end < 0) {
          relativeEnd = Math.max(size + end, 0);
        } else {
          relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new Blob([], { type: arguments[2] });
        blob[BUFFER] = slicedBuffer;
        return blob;
      }
    };
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError(message, type, systemError) {
      Error.call(this, message);
      this.message = message;
      this.type = type;
      if (systemError) {
        this.code = this.errno = systemError.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError.prototype = Object.create(Error.prototype);
    FetchError.prototype.constructor = FetchError;
    FetchError.prototype.name = "FetchError";
    var convert;
    try {
      convert = require("encoding").convert;
    } catch (e) {
    }
    var INTERNALS = Symbol("Body internals");
    var PassThrough = Stream.PassThrough;
    function Body(body) {
      var _this = this;
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
      let size = _ref$size === void 0 ? 0 : _ref$size;
      var _ref$timeout = _ref.timeout;
      let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
      if (body == null) {
        body = null;
      } else if (isURLSearchParams(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob(body))
        ;
      else if (Buffer.isBuffer(body))
        ;
      else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream)
        ;
      else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS] = {
        body,
        disturbed: false,
        error: null
      };
      this.size = size;
      this.timeout = timeout;
      if (body instanceof Stream) {
        body.on("error", function(err) {
          const error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
          _this[INTERNALS].error = error;
        });
      }
    }
    Body.prototype = {
      get body() {
        return this[INTERNALS].body;
      },
      get bodyUsed() {
        return this[INTERNALS].disturbed;
      },
      arrayBuffer() {
        return consumeBody.call(this).then(function(buf) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
      },
      blob() {
        let ct = this.headers && this.headers.get("content-type") || "";
        return consumeBody.call(this).then(function(buf) {
          return Object.assign(new Blob([], {
            type: ct.toLowerCase()
          }), {
            [BUFFER]: buf
          });
        });
      },
      json() {
        var _this2 = this;
        return consumeBody.call(this).then(function(buffer) {
          try {
            return JSON.parse(buffer.toString());
          } catch (err) {
            return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
          }
        });
      },
      text() {
        return consumeBody.call(this).then(function(buffer) {
          return buffer.toString();
        });
      },
      buffer() {
        return consumeBody.call(this);
      },
      textConverted() {
        var _this3 = this;
        return consumeBody.call(this).then(function(buffer) {
          return convertBody(buffer, _this3.headers);
        });
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    Body.mixIn = function(proto) {
      for (const name of Object.getOwnPropertyNames(Body.prototype)) {
        if (!(name in proto)) {
          const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
          Object.defineProperty(proto, name, desc);
        }
      }
    };
    function consumeBody() {
      var _this4 = this;
      if (this[INTERNALS].disturbed) {
        return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      }
      this[INTERNALS].disturbed = true;
      if (this[INTERNALS].error) {
        return Body.Promise.reject(this[INTERNALS].error);
      }
      let body = this.body;
      if (body === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob(body)) {
        body = body.stream();
      }
      if (Buffer.isBuffer(body)) {
        return Body.Promise.resolve(body);
      }
      if (!(body instanceof Stream)) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      let accum = [];
      let accumBytes = 0;
      let abort = false;
      return new Body.Promise(function(resolve, reject) {
        let resTimeout;
        if (_this4.timeout) {
          resTimeout = setTimeout(function() {
            abort = true;
            reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
          }, _this4.timeout);
        }
        body.on("error", function(err) {
          if (err.name === "AbortError") {
            abort = true;
            reject(err);
          } else {
            reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
          }
        });
        body.on("data", function(chunk) {
          if (abort || chunk === null) {
            return;
          }
          if (_this4.size && accumBytes + chunk.length > _this4.size) {
            abort = true;
            reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
            return;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        });
        body.on("end", function() {
          if (abort) {
            return;
          }
          clearTimeout(resTimeout);
          try {
            resolve(Buffer.concat(accum, accumBytes));
          } catch (err) {
            reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
          }
        });
      });
    }
    function convertBody(buffer, headers) {
      if (typeof convert !== "function") {
        throw new Error("The package `encoding` must be installed to use the textConverted() function");
      }
      const ct = headers.get("content-type");
      let charset = "utf-8";
      let res, str;
      if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
      }
      str = buffer.slice(0, 1024).toString();
      if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
      }
      if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
          res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
          if (res) {
            res.pop();
          }
        }
        if (res) {
          res = /charset=(.*)/i.exec(res.pop());
        }
      }
      if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
      }
      if (res) {
        charset = res.pop();
        if (charset === "gb2312" || charset === "gbk") {
          charset = "gb18030";
        }
      }
      return convert(buffer, "UTF-8", charset).toString();
    }
    function isURLSearchParams(obj) {
      if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
        return false;
      }
      return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
    }
    function isBlob(obj) {
      return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
    }
    function clone(instance) {
      let p1, p2;
      let body = instance.body;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream && typeof body.getBoundary !== "function") {
        p1 = new PassThrough();
        p2 = new PassThrough();
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS].body = p1;
        body = p2;
      }
      return body;
    }
    function extractContentType(body) {
      if (body === null) {
        return null;
      } else if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      } else if (isURLSearchParams(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (isBlob(body)) {
        return body.type || null;
      } else if (Buffer.isBuffer(body)) {
        return null;
      } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        return null;
      } else if (ArrayBuffer.isView(body)) {
        return null;
      } else if (typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      } else if (body instanceof Stream) {
        return null;
      } else {
        return "text/plain;charset=UTF-8";
      }
    }
    function getTotalBytes(instance) {
      const body = instance.body;
      if (body === null) {
        return 0;
      } else if (isBlob(body)) {
        return body.size;
      } else if (Buffer.isBuffer(body)) {
        return body.length;
      } else if (body && typeof body.getLengthSync === "function") {
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
          return body.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream(dest, instance) {
      const body = instance.body;
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    }
    Body.Promise = global.Promise;
    var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(name) {
      name = `${name}`;
      if (invalidTokenRegex.test(name) || name === "") {
        throw new TypeError(`${name} is not a legal HTTP header name`);
      }
    }
    function validateValue(value) {
      value = `${value}`;
      if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
      }
    }
    function find(map, name) {
      name = name.toLowerCase();
      for (const key in map) {
        if (key.toLowerCase() === name) {
          return key;
        }
      }
      return void 0;
    }
    var MAP = Symbol("map");
    var Headers = class {
      constructor() {
        let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        this[MAP] = Object.create(null);
        if (init instanceof Headers) {
          const rawHeaders = init.raw();
          const headerNames = Object.keys(rawHeaders);
          for (const headerName of headerNames) {
            for (const value of rawHeaders[headerName]) {
              this.append(headerName, value);
            }
          }
          return;
        }
        if (init == null)
          ;
        else if (typeof init === "object") {
          const method = init[Symbol.iterator];
          if (method != null) {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            const pairs = [];
            for (const pair of init) {
              if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
                throw new TypeError("Each header pair must be iterable");
              }
              pairs.push(Array.from(pair));
            }
            for (const pair of pairs) {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              this.append(pair[0], pair[1]);
            }
          } else {
            for (const key of Object.keys(init)) {
              const value = init[key];
              this.append(key, value);
            }
          }
        } else {
          throw new TypeError("Provided initializer must be an object");
        }
      }
      get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === void 0) {
          return null;
        }
        return this[MAP][key].join(", ");
      }
      forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
        let pairs = getHeaders(this);
        let i = 0;
        while (i < pairs.length) {
          var _pairs$i = pairs[i];
          const name = _pairs$i[0], value = _pairs$i[1];
          callback.call(thisArg, value, name, this);
          pairs = getHeaders(this);
          i++;
        }
      }
      set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== void 0 ? key : name] = [value];
      }
      append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          this[MAP][key].push(value);
        } else {
          this[MAP][name] = [value];
        }
      }
      has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== void 0;
      }
      delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          delete this[MAP][key];
        }
      }
      raw() {
        return this[MAP];
      }
      keys() {
        return createHeadersIterator(this, "key");
      }
      values() {
        return createHeadersIterator(this, "value");
      }
      [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
      }
    };
    Headers.prototype.entries = Headers.prototype[Symbol.iterator];
    Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers.prototype, {
      get: { enumerable: true },
      forEach: { enumerable: true },
      set: { enumerable: true },
      append: { enumerable: true },
      has: { enumerable: true },
      delete: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true }
    });
    function getHeaders(headers) {
      let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
      const keys = Object.keys(headers[MAP]).sort();
      return keys.map(kind === "key" ? function(k) {
        return k.toLowerCase();
      } : kind === "value" ? function(k) {
        return headers[MAP][k].join(", ");
      } : function(k) {
        return [k.toLowerCase(), headers[MAP][k].join(", ")];
      });
    }
    var INTERNAL = Symbol("internal");
    function createHeadersIterator(target, kind) {
      const iterator = Object.create(HeadersIteratorPrototype);
      iterator[INTERNAL] = {
        target,
        kind,
        index: 0
      };
      return iterator;
    }
    var HeadersIteratorPrototype = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
          throw new TypeError("Value of `this` is not a HeadersIterator");
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
        const values = getHeaders(target, kind);
        const len = values.length;
        if (index >= len) {
          return {
            value: void 0,
            done: true
          };
        }
        this[INTERNAL].index = index + 1;
        return {
          value: values[index],
          done: false
        };
      }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(headers) {
      const obj = Object.assign({ __proto__: null }, headers[MAP]);
      const hostHeaderKey = find(headers[MAP], "Host");
      if (hostHeaderKey !== void 0) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
      }
      return obj;
    }
    function createHeadersLenient(obj) {
      const headers = new Headers();
      for (const name of Object.keys(obj)) {
        if (invalidTokenRegex.test(name)) {
          continue;
        }
        if (Array.isArray(obj[name])) {
          for (const val of obj[name]) {
            if (invalidHeaderCharRegex.test(val)) {
              continue;
            }
            if (headers[MAP][name] === void 0) {
              headers[MAP][name] = [val];
            } else {
              headers[MAP][name].push(val);
            }
          }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
          headers[MAP][name] = [obj[name]];
        }
      }
      return headers;
    }
    var INTERNALS$1 = Symbol("Response internals");
    var STATUS_CODES = http.STATUS_CODES;
    var Response = class {
      constructor() {
        let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        Body.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers(opts.headers);
        if (body != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          url: opts.url,
          status,
          statusText: opts.statusText || STATUS_CODES[status],
          headers,
          counter: opts.counter
        };
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      clone() {
        return new Response(clone(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    };
    Body.mixIn(Response.prototype);
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    Object.defineProperty(Response.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: false,
      enumerable: false,
      configurable: true
    });
    var INTERNALS$2 = Symbol("Request internals");
    var parse_url = Url.parse;
    var format_url = Url.format;
    var streamDestructionSupported = "destroy" in Stream.Readable.prototype;
    function isRequest(input) {
      return typeof input === "object" && typeof input[INTERNALS$2] === "object";
    }
    function isAbortSignal(signal) {
      const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
      return !!(proto && proto.constructor.name === "AbortSignal");
    }
    var Request = class {
      constructor(input) {
        let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let parsedURL;
        if (!isRequest(input)) {
          if (input && input.href) {
            parsedURL = parse_url(input.href);
          } else {
            parsedURL = parse_url(`${input}`);
          }
          input = {};
        } else {
          parsedURL = parse_url(input.url);
        }
        let method = init.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
        Body.call(this, inputBody, {
          timeout: init.timeout || input.timeout || 0,
          size: init.size || input.size || 0
        });
        const headers = new Headers(init.headers || input.headers || {});
        if (inputBody != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init)
          signal = init.signal;
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS$2] = {
          method,
          redirect: init.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20;
        this.compress = init.compress !== void 0 ? init.compress : input.compress !== void 0 ? input.compress : true;
        this.counter = init.counter || input.counter || 0;
        this.agent = init.agent || input.agent;
      }
      get method() {
        return this[INTERNALS$2].method;
      }
      get url() {
        return format_url(this[INTERNALS$2].parsedURL);
      }
      get headers() {
        return this[INTERNALS$2].headers;
      }
      get redirect() {
        return this[INTERNALS$2].redirect;
      }
      get signal() {
        return this[INTERNALS$2].signal;
      }
      clone() {
        return new Request(this);
      }
    };
    Body.mixIn(Request.prototype);
    Object.defineProperty(Request.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    function getNodeRequestOptions(request) {
      const parsedURL = request[INTERNALS$2].parsedURL;
      const headers = new Headers(request[INTERNALS$2].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError("Only absolute URLs are supported");
      }
      if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
      }
      if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
        throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
      }
      let contentLengthValue = null;
      if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body != null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number") {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate");
      }
      let agent = request.agent;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
      });
    }
    function AbortError(message) {
      Error.call(this, message);
      this.type = "aborted";
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError.prototype = Object.create(Error.prototype);
    AbortError.prototype.constructor = AbortError;
    AbortError.prototype.name = "AbortError";
    var PassThrough$1 = Stream.PassThrough;
    var resolve_url = Url.resolve;
    function fetch(url, opts) {
      if (!fetch.Promise) {
        throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      }
      Body.Promise = fetch.Promise;
      return new fetch.Promise(function(resolve, reject) {
        const request = new Request(url, opts);
        const options = getNodeRequestOptions(request);
        const send = (options.protocol === "https:" ? https : http).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort2() {
          let error = new AbortError("The user aborted a request.");
          reject(error);
          if (request.body && request.body instanceof Stream.Readable) {
            request.body.destroy(error);
          }
          if (!response || !response.body)
            return;
          response.body.emit("error", error);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = function abortAndFinalize2() {
          abort();
          finalize();
        };
        const req = send(options);
        let reqTimeout;
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        function finalize() {
          req.abort();
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
          clearTimeout(reqTimeout);
        }
        if (request.timeout) {
          req.once("socket", function(socket) {
            reqTimeout = setTimeout(function() {
              reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
              finalize();
            }, request.timeout);
          });
        }
        req.on("error", function(err) {
          reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
          finalize();
        });
        req.on("response", function(res) {
          clearTimeout(reqTimeout);
          const headers = createHeadersLenient(res.headers);
          if (fetch.isRedirect(res.statusCode)) {
            const location = headers.get("Location");
            const locationURL = location === null ? null : resolve_url(request.url, location);
            switch (request.redirect) {
              case "error":
                reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  try {
                    headers.set("Location", locationURL);
                  } catch (err) {
                    reject(err);
                  }
                }
                break;
              case "follow":
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOpts = {
                  headers: new Headers(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: request.body,
                  signal: request.signal,
                  timeout: request.timeout,
                  size: request.size
                };
                if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                  reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                  requestOpts.method = "GET";
                  requestOpts.body = void 0;
                  requestOpts.headers.delete("content-length");
                }
                resolve(fetch(new Request(locationURL, requestOpts)));
                finalize();
                return;
            }
          }
          res.once("end", function() {
            if (signal)
              signal.removeEventListener("abort", abortAndFinalize);
          });
          let body = res.pipe(new PassThrough$1());
          const response_options = {
            url: request.url,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers,
            size: request.size,
            timeout: request.timeout,
            counter: request.counter
          };
          const codings = headers.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          const zlibOptions = {
            flush: zlib.Z_SYNC_FLUSH,
            finishFlush: zlib.Z_SYNC_FLUSH
          };
          if (codings == "gzip" || codings == "x-gzip") {
            body = body.pipe(zlib.createGunzip(zlibOptions));
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          if (codings == "deflate" || codings == "x-deflate") {
            const raw = res.pipe(new PassThrough$1());
            raw.once("data", function(chunk) {
              if ((chunk[0] & 15) === 8) {
                body = body.pipe(zlib.createInflate());
              } else {
                body = body.pipe(zlib.createInflateRaw());
              }
              response = new Response(body, response_options);
              resolve(response);
            });
            return;
          }
          if (codings == "br" && typeof zlib.createBrotliDecompress === "function") {
            body = body.pipe(zlib.createBrotliDecompress());
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          response = new Response(body, response_options);
          resolve(response);
        });
        writeToStream(req, request);
      });
    }
    fetch.isRedirect = function(code) {
      return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
    };
    fetch.Promise = global.Promise;
    module2.exports = exports2 = fetch;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.default = exports2;
    exports2.Headers = Headers;
    exports2.Request = Request;
    exports2.Response = Response;
    exports2.FetchError = FetchError;
  }
});

// node_modules/@notionhq/client/build/package.json
var require_package = __commonJS({
  "node_modules/@notionhq/client/build/package.json"(exports2, module2) {
    module2.exports = {
      name: "@notionhq/client",
      version: "0.2.4",
      description: "A simple and easy to use client for the Notion API",
      engines: {
        node: ">=12"
      },
      homepage: "https://developers.notion.com/docs/getting-started",
      bugs: {
        url: "https://github.com/makenotion/notion-sdk-js/issues"
      },
      repository: {
        type: "git",
        url: "https://github.com/makenotion/notion-sdk-js/"
      },
      keywords: [
        "notion",
        "notionapi",
        "rest",
        "notion-api"
      ],
      main: "./build/src",
      scripts: {
        prepare: "npm run build",
        prepublishOnly: "npm run lint && npm run test",
        build: "tsc",
        prettier: "prettier --write .",
        lint: "prettier --check . && eslint . --ext .ts && cspell '**/*' ",
        test: "ava",
        "check-links": "git ls-files | grep md$ | xargs -n 1 markdown-link-check",
        prebuild: "npm run clean",
        clean: "rm -rf ./build"
      },
      author: "",
      license: "MIT",
      files: [
        "build/package.json",
        "build/src/**"
      ],
      dependencies: {
        "@types/node-fetch": "^2.5.10",
        "node-fetch": "^2.6.1"
      },
      devDependencies: {
        "@ava/typescript": "^2.0.0",
        "@typescript-eslint/eslint-plugin": "^4.22.0",
        "@typescript-eslint/parser": "^4.22.0",
        ava: "^3.15.0",
        cspell: "^5.4.1",
        eslint: "^7.24.0",
        "markdown-link-check": "^3.8.7",
        prettier: "^2.3.0",
        typescript: "^4.2.4"
      }
    };
  }
});

// node_modules/@notionhq/client/build/src/Client.js
var require_Client = __commonJS({
  "node_modules/@notionhq/client/build/src/Client.js"(exports2) {
    "use strict";
    var __classPrivateFieldSet = exports2 && exports2.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports2 && exports2.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _Client_auth;
    var _Client_logLevel;
    var _Client_logger;
    var _Client_prefixUrl;
    var _Client_timeoutMs;
    var _Client_notionVersion;
    var _Client_fetch;
    var _Client_agent;
    var _Client_userAgent;
    Object.defineProperty(exports2, "__esModule", { value: true });
    var logging_1 = require_logging();
    var errors_1 = require_errors();
    var helpers_1 = require_helpers();
    var api_endpoints_1 = require_api_endpoints();
    var node_fetch_1 = require_lib();
    var package_json_1 = require_package();
    var Client2 = class {
      constructor(options) {
        var _a, _b, _c, _d, _e, _f;
        _Client_auth.set(this, void 0);
        _Client_logLevel.set(this, void 0);
        _Client_logger.set(this, void 0);
        _Client_prefixUrl.set(this, void 0);
        _Client_timeoutMs.set(this, void 0);
        _Client_notionVersion.set(this, void 0);
        _Client_fetch.set(this, void 0);
        _Client_agent.set(this, void 0);
        _Client_userAgent.set(this, void 0);
        this.blocks = {
          retrieve: (args) => {
            return this.request({
              path: api_endpoints_1.blocksRetrieve.path(args),
              method: api_endpoints_1.blocksRetrieve.method,
              query: helpers_1.pick(args, api_endpoints_1.blocksRetrieve.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.blocksRetrieve.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          update: (args) => {
            return this.request({
              path: api_endpoints_1.blocksUpdate.path(args),
              method: api_endpoints_1.blocksUpdate.method,
              query: helpers_1.pick(args, api_endpoints_1.blocksUpdate.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.blocksUpdate.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          children: {
            append: (args) => {
              return this.request({
                path: api_endpoints_1.blocksChildrenAppend.path(args),
                method: api_endpoints_1.blocksChildrenAppend.method,
                query: helpers_1.pick(args, api_endpoints_1.blocksChildrenAppend.queryParams),
                body: helpers_1.pick(args, api_endpoints_1.blocksChildrenAppend.bodyParams),
                auth: args === null || args === void 0 ? void 0 : args.auth
              });
            },
            list: (args) => {
              return this.request({
                path: api_endpoints_1.blocksChildrenList.path(args),
                method: api_endpoints_1.blocksChildrenList.method,
                query: helpers_1.pick(args, api_endpoints_1.blocksChildrenList.queryParams),
                body: helpers_1.pick(args, api_endpoints_1.blocksChildrenList.bodyParams),
                auth: args === null || args === void 0 ? void 0 : args.auth
              });
            }
          }
        };
        this.databases = {
          list: (args = {}) => {
            return this.request({
              path: api_endpoints_1.databasesList.path(),
              method: api_endpoints_1.databasesList.method,
              query: helpers_1.pick(args, api_endpoints_1.databasesList.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.databasesList.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          retrieve: (args) => {
            return this.request({
              path: api_endpoints_1.databasesRetrieve.path(args),
              method: api_endpoints_1.databasesRetrieve.method,
              query: helpers_1.pick(args, api_endpoints_1.databasesRetrieve.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.databasesRetrieve.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          query: (args) => {
            return this.request({
              path: api_endpoints_1.databasesQuery.path(args),
              method: api_endpoints_1.databasesQuery.method,
              query: helpers_1.pick(args, api_endpoints_1.databasesQuery.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.databasesQuery.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          create: (args) => {
            return this.request({
              path: api_endpoints_1.databasesCreate.path(),
              method: api_endpoints_1.databasesCreate.method,
              query: helpers_1.pick(args, api_endpoints_1.databasesCreate.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.databasesCreate.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }
        };
        this.pages = {
          create: (args) => {
            return this.request({
              path: api_endpoints_1.pagesCreate.path(),
              method: api_endpoints_1.pagesCreate.method,
              query: helpers_1.pick(args, api_endpoints_1.pagesCreate.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.pagesCreate.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          retrieve: (args) => {
            return this.request({
              path: api_endpoints_1.pagesRetrieve.path(args),
              method: api_endpoints_1.pagesRetrieve.method,
              query: helpers_1.pick(args, api_endpoints_1.pagesRetrieve.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.pagesRetrieve.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          update: (args) => {
            return this.request({
              path: api_endpoints_1.pagesUpdate.path(args),
              method: api_endpoints_1.pagesUpdate.method,
              query: helpers_1.pick(args, api_endpoints_1.pagesUpdate.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.pagesUpdate.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }
        };
        this.users = {
          retrieve: (args) => {
            return this.request({
              path: api_endpoints_1.usersRetrieve.path(args),
              method: api_endpoints_1.usersRetrieve.method,
              query: helpers_1.pick(args, api_endpoints_1.usersRetrieve.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.usersRetrieve.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          list: (args = {}) => {
            return this.request({
              path: api_endpoints_1.usersList.path(),
              method: api_endpoints_1.usersList.method,
              query: helpers_1.pick(args, api_endpoints_1.usersList.queryParams),
              body: helpers_1.pick(args, api_endpoints_1.usersList.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }
        };
        __classPrivateFieldSet(this, _Client_auth, options === null || options === void 0 ? void 0 : options.auth, "f");
        __classPrivateFieldSet(this, _Client_logLevel, (_a = options === null || options === void 0 ? void 0 : options.logLevel) !== null && _a !== void 0 ? _a : logging_1.LogLevel.WARN, "f");
        __classPrivateFieldSet(this, _Client_logger, (_b = options === null || options === void 0 ? void 0 : options.logger) !== null && _b !== void 0 ? _b : logging_1.makeConsoleLogger(package_json_1.name), "f");
        __classPrivateFieldSet(this, _Client_prefixUrl, ((_c = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _c !== void 0 ? _c : "https://api.notion.com") + "/v1/", "f");
        __classPrivateFieldSet(this, _Client_timeoutMs, (_d = options === null || options === void 0 ? void 0 : options.timeoutMs) !== null && _d !== void 0 ? _d : 6e4, "f");
        __classPrivateFieldSet(this, _Client_notionVersion, (_e = options === null || options === void 0 ? void 0 : options.notionVersion) !== null && _e !== void 0 ? _e : Client2.defaultNotionVersion, "f");
        __classPrivateFieldSet(this, _Client_fetch, (_f = options === null || options === void 0 ? void 0 : options.fetch) !== null && _f !== void 0 ? _f : node_fetch_1.default, "f");
        __classPrivateFieldSet(this, _Client_agent, options === null || options === void 0 ? void 0 : options.agent, "f");
        __classPrivateFieldSet(this, _Client_userAgent, `notionhq-client/${package_json_1.version}`, "f");
      }
      async request({ path, method, query, body, auth }) {
        this.log(logging_1.LogLevel.INFO, "request start", { method, path });
        const bodyAsJsonString = !body || Object.entries(body).length === 0 ? void 0 : JSON.stringify(body);
        const url = new URL(`${__classPrivateFieldGet(this, _Client_prefixUrl, "f")}${path}`);
        if (query) {
          for (const [key, value] of Object.entries(query)) {
            if (value !== void 0) {
              url.searchParams.append(key, String(value));
            }
          }
        }
        const headers = __spreadProps(__spreadValues({}, this.authAsHeaders(auth)), {
          "Notion-Version": __classPrivateFieldGet(this, _Client_notionVersion, "f"),
          "user-agent": __classPrivateFieldGet(this, _Client_userAgent, "f")
        });
        if (bodyAsJsonString !== void 0) {
          headers["content-type"] = "application/json";
        }
        try {
          const response = await errors_1.RequestTimeoutError.rejectAfterTimeout(__classPrivateFieldGet(this, _Client_fetch, "f").call(this, url.toString(), {
            method,
            headers,
            body: bodyAsJsonString,
            agent: __classPrivateFieldGet(this, _Client_agent, "f")
          }), __classPrivateFieldGet(this, _Client_timeoutMs, "f"));
          const responseText = await response.text();
          if (!response.ok) {
            throw errors_1.buildRequestError(response, responseText);
          }
          const responseJson = JSON.parse(responseText);
          this.log(logging_1.LogLevel.INFO, `request success`, { method, path });
          return responseJson;
        } catch (error) {
          if (!errors_1.isNotionClientError(error)) {
            throw error;
          }
          this.log(logging_1.LogLevel.WARN, `request fail`, {
            code: error.code,
            message: error.message
          });
          if (errors_1.isHTTPResponseError(error)) {
            this.log(logging_1.LogLevel.DEBUG, `failed response body`, {
              body: error.body
            });
          }
          throw error;
        }
      }
      search(args) {
        return this.request({
          path: api_endpoints_1.search.path(),
          method: api_endpoints_1.search.method,
          query: helpers_1.pick(args, api_endpoints_1.search.queryParams),
          body: helpers_1.pick(args, api_endpoints_1.search.bodyParams),
          auth: args === null || args === void 0 ? void 0 : args.auth
        });
      }
      log(level, message, extraInfo) {
        if (logging_1.logLevelSeverity(level) >= logging_1.logLevelSeverity(__classPrivateFieldGet(this, _Client_logLevel, "f"))) {
          __classPrivateFieldGet(this, _Client_logger, "f").call(this, level, message, extraInfo);
        }
      }
      authAsHeaders(auth) {
        const headers = {};
        const authHeaderValue = auth !== null && auth !== void 0 ? auth : __classPrivateFieldGet(this, _Client_auth, "f");
        if (authHeaderValue !== void 0) {
          headers["authorization"] = `Bearer ${authHeaderValue}`;
        }
        return headers;
      }
    };
    exports2.default = Client2;
    _Client_auth = new WeakMap(), _Client_logLevel = new WeakMap(), _Client_logger = new WeakMap(), _Client_prefixUrl = new WeakMap(), _Client_timeoutMs = new WeakMap(), _Client_notionVersion = new WeakMap(), _Client_fetch = new WeakMap(), _Client_agent = new WeakMap(), _Client_userAgent = new WeakMap();
    Client2.defaultNotionVersion = "2021-05-13";
  }
});

// node_modules/@notionhq/client/build/src/index.js
var require_src = __commonJS({
  "node_modules/@notionhq/client/build/src/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isNotionClientError = exports2.RequestTimeoutError = exports2.UnknownHTTPResponseError = exports2.APIResponseError = exports2.ClientErrorCode = exports2.APIErrorCode = exports2.LogLevel = exports2.Client = void 0;
    var Client_1 = require_Client();
    Object.defineProperty(exports2, "Client", { enumerable: true, get: function() {
      return Client_1.default;
    } });
    var logging_1 = require_logging();
    Object.defineProperty(exports2, "LogLevel", { enumerable: true, get: function() {
      return logging_1.LogLevel;
    } });
    var errors_1 = require_errors();
    Object.defineProperty(exports2, "APIErrorCode", { enumerable: true, get: function() {
      return errors_1.APIErrorCode;
    } });
    Object.defineProperty(exports2, "ClientErrorCode", { enumerable: true, get: function() {
      return errors_1.ClientErrorCode;
    } });
    Object.defineProperty(exports2, "APIResponseError", { enumerable: true, get: function() {
      return errors_1.APIResponseError;
    } });
    Object.defineProperty(exports2, "UnknownHTTPResponseError", { enumerable: true, get: function() {
      return errors_1.UnknownHTTPResponseError;
    } });
    Object.defineProperty(exports2, "RequestTimeoutError", { enumerable: true, get: function() {
      return errors_1.RequestTimeoutError;
    } });
    Object.defineProperty(exports2, "isNotionClientError", { enumerable: true, get: function() {
      return errors_1.isNotionClientError;
    } });
  }
});

// app/src/.netlify/functions/fetchNotionTables/fetchNotionTables.ts
var { Client } = require_src();
var notion = new Client({ auth: process.env.NOTION_API });
var handler = async (event) => {
  const databaseId = "7b4380f82c6644c1859f9bb4b12a20a2";
  try {
    const response = await notion.databases.query({
      database_id: databaseId
    });
    let { results } = response;
    results = results.sort((a, b) => {
      let leftHand = a.properties.id.number;
      let rightHand = b.properties.id.number;
      return leftHand - rightHand;
    });
    let matchingResults = results.map((result) => {
      return {
        title: result.properties.Name.title[0].plain_text,
        watermark: result.properties.watermark.rich_text[0].plain_text,
        description: result.properties.Description.rich_text[0].plain_text,
        thumbnail_url: result.properties.thumbnail_url.rich_text[0].text.link.url,
        project_url: result.properties.work_url.url
      };
    });
    return {
      statusCode: 200,
      body: JSON.stringify(matchingResults)
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};
module.exports = { handler };
//# sourceMappingURL=fetchNotionTables.js.map
