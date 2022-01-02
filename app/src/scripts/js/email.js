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
exports.setupEmailSender = void 0;
var web_1 = require("@splitbee/web");
var emailjs_com_1 = require("emailjs-com");
var setupEmailSender = function () { };
exports.setupEmailSender = setupEmailSender;
$("form").submit(function (e) {
    return __awaiter(void 0, void 0, void 0, function () {
        var user_id, templateParams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user_id = "user_z3F7jyQ8qvbeOobnstw7p";
                    emailjs_com_1["default"].init(user_id);
                    e.preventDefault();
                    $(".form-error").hide();
                    $(".form-error").removeClass("success");
                    $("form input[type=text], #message").css("border", "none");
                    if (!($("form textarea, form input[type=email], form input[type=name]").val() ===
                        ""))
                        return [3 /*break*/, 1];
                    $(".form-error").show().html("Please, fill in all the fields.");
                    $("form textarea, form input[type=email], form input[type=name]").css("border", "1px solid #DC000F");
                    return [3 /*break*/, 3];
                case 1:
                    // Sending the email
                    $(".form-error").html("");
                    templateParams = {
                        name: $("#name").val(),
                        email: $("#email").val(),
                        message: $("#message").val()
                    };
                    return [4 /*yield*/, emailjs_com_1["default"].send("gmail", "msg", templateParams).then(function () {
                            $(".form-error")
                                .html("Your message was successfully sent!")
                                .addClass("success")
                                .show();
                            $("#email, #name, form textarea").val("");
                            $("form input, form textarea").css("border", "none");
                            $("#email").focus();
                        }, function () {
                            $(".form-error")
                                .html("Something went wrong... Refresh page and try again.")
                                .show();
                        })];
                case 2:
                    _a.sent();
                    // send the information to the tracking platform
                    web_1["default"].track("email sent", {
                        user: templateParams.email
                    });
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
});
