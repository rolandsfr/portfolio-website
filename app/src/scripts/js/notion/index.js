"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1)
            throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f)
            throw new TypeError("Generator is already executing.");
        while (_)
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                    return t;
                if (y = 0, t)
                    op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return { value: op[1], done: false };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2])
                            _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            }
            catch (e) {
                op = [6, e];
                y = 0;
            }
            finally {
                f = t = 0;
            }
        if (op[0] & 5)
            throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.renderRecords = exports.fetchNotionInfo = void 0;
// preloader stuff
var image_preload_1 = require("image-preload");
var image_preload_2 = require("image-preload");
var web_1 = require("@splitbee/web");
var fetchNotionInfo = function (endPoint) {
    return __awaiter(void 0, void 0, void 0, function () {
        var response, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("./.netlify/functions" + endPoint)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
};
exports.fetchNotionInfo = fetchNotionInfo;
var createNewRecord = function (_a) {
    var description = _a.description, thumbnail_url = _a.thumbnail_url, title = _a.title, watermark = _a.watermark, project_url = _a.project_url;
    var record = document.createElement("div");
    record.classList.add("work");
    record.setAttribute("data-aos", "fade-up");
    var thumbnail_img = new Image();
    thumbnail_img.src = "./assets/img/placeholder.png";
    thumbnail_img.setAttribute("data-aos", "fade-up");
    thumbnail_img.setAttribute("data-aos-delay", "100");
    thumbnail_img.className = "work-img";
    thumbnail_img.alt = "thumbnail";
    var template = "\n    <div class=\"work-container\">\n        <div class=\"work-details\">\n            <h1 class=\"watermark\">" + watermark + "</h1>\n            <div class=\"details-content\">\n                <h3 class=\"work-title\">" + title + "</h3>\n                <p class=\"work-descr\">\n                    " + description + "\n                </p>\n                <a href=\"" + project_url + "\" class=\"view-work\">View work</a>\n            </div>\n        </div>\n        <img src=\"assets/img/icons8-coderwall.svg\" alt=\"icon\" class=\"work-icon\">\n    </div>\n  ";
    record.innerHTML = template;
    record.append(thumbnail_img);
    // tracking for showcased projects
    $(record)
        .find(".view-work")
        .on("click", function (e) {
        var _a;
        e.preventDefault();
        web_1["default"].track("click on project", {
            url: project_url
        });
        (_a = window.open(project_url, "_blank")) === null || _a === void 0 ? void 0 : _a.focus();
    });
    return { record: record, img: thumbnail_img, src: thumbnail_url };
};
var renderRecords = function (records, rootElement) {
    var allImages = [];
    var urlsToFetch = [];
    records.forEach(function (record) {
        var recordElement = createNewRecord(record);
        allImages.push(recordElement.img);
        urlsToFetch.push(recordElement.src);
        rootElement.append(recordElement.record);
    });
    var index = 0;
    image_preload_1["default"](urlsToFetch, {
        order: image_preload_2.Order.InOrder,
        inBackground: true,
        toBase64: true,
        onSingleImageComplete: function (base64) {
            allImages[index].src = base64;
            index++;
        }
    });
};
exports.renderRecords = renderRecords;
