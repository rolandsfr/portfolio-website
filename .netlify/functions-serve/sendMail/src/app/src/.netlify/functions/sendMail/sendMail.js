var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/emailjs-com/cjs/store/store.js
var require_store = __commonJS({
  "node_modules/emailjs-com/cjs/store/store.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.store = void 0;
    exports.store = {
      _origin: "https://api.emailjs.com"
    };
  }
});

// node_modules/emailjs-com/cjs/methods/init/init.js
var require_init = __commonJS({
  "node_modules/emailjs-com/cjs/methods/init/init.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.init = void 0;
    var store_1 = require_store();
    var init = (userID, origin = "https://api.emailjs.com") => {
      store_1.store._userID = userID;
      store_1.store._origin = origin;
    };
    exports.init = init;
  }
});

// node_modules/emailjs-com/cjs/utils/validateParams.js
var require_validateParams = __commonJS({
  "node_modules/emailjs-com/cjs/utils/validateParams.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateParams = void 0;
    var validateParams = (userID, serviceID, templateID) => {
      if (!userID) {
        throw "The user ID is required. Visit https://dashboard.emailjs.com/admin/integration";
      }
      if (!serviceID) {
        throw "The service ID is required. Visit https://dashboard.emailjs.com/admin";
      }
      if (!templateID) {
        throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates";
      }
      return true;
    };
    exports.validateParams = validateParams;
  }
});

// node_modules/emailjs-com/cjs/models/EmailJSResponseStatus.js
var require_EmailJSResponseStatus = __commonJS({
  "node_modules/emailjs-com/cjs/models/EmailJSResponseStatus.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EmailJSResponseStatus = void 0;
    var EmailJSResponseStatus = class {
      constructor(httpResponse) {
        this.status = httpResponse.status;
        this.text = httpResponse.responseText;
      }
    };
    exports.EmailJSResponseStatus = EmailJSResponseStatus;
  }
});

// node_modules/emailjs-com/cjs/api/sendPost.js
var require_sendPost = __commonJS({
  "node_modules/emailjs-com/cjs/api/sendPost.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendPost = void 0;
    var EmailJSResponseStatus_1 = require_EmailJSResponseStatus();
    var store_1 = require_store();
    var sendPost = (url, data, headers = {}) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", ({ target }) => {
          const responseStatus = new EmailJSResponseStatus_1.EmailJSResponseStatus(target);
          if (responseStatus.status === 200 || responseStatus.text === "OK") {
            resolve(responseStatus);
          } else {
            reject(responseStatus);
          }
        });
        xhr.addEventListener("error", ({ target }) => {
          reject(new EmailJSResponseStatus_1.EmailJSResponseStatus(target));
        });
        xhr.open("POST", store_1.store._origin + url, true);
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });
        xhr.send(data);
      });
    };
    exports.sendPost = sendPost;
  }
});

// node_modules/emailjs-com/cjs/methods/send/send.js
var require_send = __commonJS({
  "node_modules/emailjs-com/cjs/methods/send/send.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.send = void 0;
    var store_1 = require_store();
    var validateParams_1 = require_validateParams();
    var sendPost_1 = require_sendPost();
    var send = (serviceID, templateID, templatePrams, userID) => {
      const uID = userID || store_1.store._userID;
      validateParams_1.validateParams(uID, serviceID, templateID);
      const params = {
        lib_version: "3.2.0",
        user_id: uID,
        service_id: serviceID,
        template_id: templateID,
        template_params: templatePrams
      };
      return sendPost_1.sendPost("/api/v1.0/email/send", JSON.stringify(params), {
        "Content-type": "application/json"
      });
    };
    exports.send = send;
  }
});

// node_modules/emailjs-com/cjs/methods/sendForm/sendForm.js
var require_sendForm = __commonJS({
  "node_modules/emailjs-com/cjs/methods/sendForm/sendForm.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendForm = void 0;
    var store_1 = require_store();
    var validateParams_1 = require_validateParams();
    var sendPost_1 = require_sendPost();
    var findHTMLForm = (form) => {
      let currentForm;
      if (typeof form === "string") {
        currentForm = document.querySelector(form);
      } else {
        currentForm = form;
      }
      if (!currentForm || currentForm.nodeName !== "FORM") {
        throw "The 3rd parameter is expected to be the HTML form element or the style selector of form";
      }
      return currentForm;
    };
    var sendForm = (serviceID, templateID, form, userID) => {
      const uID = userID || store_1.store._userID;
      const currentForm = findHTMLForm(form);
      validateParams_1.validateParams(uID, serviceID, templateID);
      const formData = new FormData(currentForm);
      formData.append("lib_version", "3.2.0");
      formData.append("service_id", serviceID);
      formData.append("template_id", templateID);
      formData.append("user_id", uID);
      return sendPost_1.sendPost("/api/v1.0/email/send-form", formData);
    };
    exports.sendForm = sendForm;
  }
});

// node_modules/emailjs-com/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/emailjs-com/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendForm = exports.send = exports.init = void 0;
    var init_1 = require_init();
    Object.defineProperty(exports, "init", { enumerable: true, get: function() {
      return init_1.init;
    } });
    var send_1 = require_send();
    Object.defineProperty(exports, "send", { enumerable: true, get: function() {
      return send_1.send;
    } });
    var sendForm_1 = require_sendForm();
    Object.defineProperty(exports, "sendForm", { enumerable: true, get: function() {
      return sendForm_1.sendForm;
    } });
    exports.default = {
      init: init_1.init,
      send: send_1.send,
      sendForm: sendForm_1.sendForm
    };
  }
});

// app/src/.netlify/functions/sendMail/sendMail.ts
__export(exports, {
  handler: () => handler
});
var import_emailjs_com = __toModule(require_cjs());
var handler = async (event, context) => {
  const { EMAIL_JS } = process.env;
  import_emailjs_com.default.init(EMAIL_JS);
  const { email, name, message } = JSON.parse(event.body);
  let templateParams = {
    name,
    email,
    message
  };
  let response = {
    responseText: "",
    successful: true
  };
  try {
    await import_emailjs_com.default.send("gmail", "msg", templateParams);
    response.responseText = "Your message was successfully sent!";
    response.successful = true;
  } catch (e) {
    response.responseText = e.message;
    response.successful = false;
  }
  return {
    body: JSON.stringify(response),
    statusCode: 200
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=sendMail.js.map
