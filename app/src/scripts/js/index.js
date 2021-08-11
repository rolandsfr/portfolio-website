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
var AOS = require("aos");
// notion api stuff
var index_1 = require("./notion/index");
var notionEndpoints_1 = require("./notion/notionEndpoints");
var cursorSetup_1 = require("./cursorSetup");
// test variables
// import { fetchedRecords } from "./exampleWorks";
(function () {
    return __awaiter(void 0, void 0, void 0, function () {
        var heroImage, heroImageFetched, heroImageUrl, e_1, fetchedRecords, error_1, errorDiv;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    heroImage = document.querySelector(".bg-img");
                    return [4 /*yield*/, index_1.fetchNotionInfo(notionEndpoints_1.notionEndpoints.HERO_IMAGE)];
                case 1:
                    heroImageFetched = _b.sent();
                    heroImageUrl = heroImageFetched.url;
                    setBackgroundImg(heroImage, heroImageUrl);
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _b.sent();
                    return [3 /*break*/, 3];
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, index_1.fetchNotionInfo(notionEndpoints_1.notionEndpoints.WORKS)];
                case 4:
                    fetchedRecords = _b.sent();
                    console.log(fetchedRecords);
                    index_1.renderRecords(fetchedRecords, document.querySelector(".works"));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    (_a = document.querySelector(".works")) === null || _a === void 0 ? void 0 : _a.remove();
                    errorDiv = Array.from(document.getElementsByClassName("fetch-error"))[0];
                    errorDiv.style.display = "block";
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
})();
setBackgroundImgtoAll();
cursorSetup_1.cursorSetup(0.1);
var bars = $(".burger-menu"), autoScroll = false;
var hidePreloader = function () {
    setTimeout(function () {
        $(".preloader").animate({ opacity: 0 }, 400, function () {
            $(".preloader").hide();
        });
    }, 1500);
};
var setMainWrapperHeight = function () {
    var h = $(".about-wrapper .container").height();
    if (h) {
        $(".about-wrapper").height(h);
    }
};
var initAnimations = function () {
    setTimeout(function () {
        AOS.init({
            easing: "ease",
            duration: 1000,
            once: true,
            disable: function () {
                return !($(document).width() >= 1024);
            }
        });
        showPageOverflowOnYAxis();
    }, 1000);
};
var showPageOverflowOnYAxis = function () {
    var screen = document.getElementById("screen");
    screen.style.height = "inherit";
};
// // Hiding prelaoder and initializing AOS animations
$(window).on("load", function () {
    hidePreloader();
    setMainWrapperHeight();
    initAnimations();
});
// Top navigation changes it's background on scroll on mobile devices
$(window).resize(function () {
    if (autoScroll) {
        setTimeout(showNavOnResize, 500);
    }
    else {
        showNavOnResize();
    }
    setMainWrapperHeight();
});
$(window).scroll(function () {
    if (autoScroll) {
        setTimeout(showNav, 2000);
        autoScroll = false;
    }
    else {
        showNav();
    }
});
function showNav() {
    if ($(document).width() <= 816) {
        if ($(document).scrollTop() > 10) {
            $(".top-menu").addClass("scrolled");
        }
        else {
            $(".top-menu").removeClass("scrolled");
        }
        if ($(document).scrollTop() > 250) {
            $(".top-menu").css("border-bottom", "1px solid #f0f0f0");
        }
        else {
            $(".top-menu").css("border-bottom", "none");
        }
    }
    else {
        $(".top-menu").removeClass("scrolled");
    }
}
function showNavOnResize() {
    if ($(document).width() <= 816) {
        $(".top-menu").show();
        $(window).scroll(function () {
            if ($(document).scrollTop() > 10) {
                $(".top-menu").addClass("scrolled");
            }
            else {
                $(".top-menu").removeClass("scrolled");
            }
            if ($(document).scrollTop() > 250) {
                $(".top-menu").css("border-bottom", "1px solid #f0f0f0");
            }
            else {
                $(".top-menu").css("border-bottom", "none");
            }
        });
    }
    else {
        $(".top-menu").hide();
    }
}
// Wrapping and unwrapping #mainScreen elements for responsiveness reasons
var container = $(document.createElement("div")).addClass("container"), container_spec = $(document.createElement("div")).addClass("container spec");
var adaptWrapperFormobile = function () {
    if ($(document).width() < 1025) {
        $(".basic-info").wrap(container);
        $(".view-portfolio").wrap(container_spec);
    }
    else {
        $(".basic-info").unwrap(".container");
        $(".view-portfolio").unwrap(".container");
    }
};
adaptWrapperFormobile();
$(window).resize(function () {
    $(".basic-info").unwrap(".container");
    $(".view-portfolio").unwrap(".container");
    adaptWrapperFormobile();
});
$(".desktop-nav a").click(function (e) {
    var _a;
    e.preventDefault();
    var attrEl = $(e.target).attr("href");
    var links = $(attrEl);
    if (links) {
        var top_1 = (_a = links.offset()) === null || _a === void 0 ? void 0 : _a.top;
        if (top_1) {
            $("html, body").animate({ scrollTop: top_1 - 40 }, 700, function () {
                autoScroll = true;
            });
        }
    }
});
// Navigational scrolling
bars.on("click", function () {
    $(".overlap").animate({ "margin-left": "0" }, 400);
    setTimeout(function () {
        $(".nav-menu-mobile").addClass("popUp");
        $(".nav-menu-mobile li").addClass("getInPlace");
    }, 150);
});
bars.click("click", function () {
    setTimeout(function () {
        $(".close-menu").addClass("open-menu");
    }, 500);
});
var animateMobileMenu = function () {
    setTimeout(function () {
        $(".overlap").animate({ "margin-left": "240%" }, 400);
    }, 150);
    $(".nav-menu-mobile").toggleClass("popUp");
    $(".nav-menu-mobile li").removeClass("getInPlace");
};
$(".close-menu span").click(function () {
    $(".close-menu").removeClass("open-menu");
    animateMobileMenu();
});
$(".nav-menu-mobile a").click(function (e) {
    e.preventDefault();
    navigateToSection(e, 10);
    $(".close-menu").removeClass("open-menu");
    setTimeout(function () {
        animateMobileMenu();
    }, 150);
});
$(".footer-links a").click(function (e) {
    var _a;
    if ($(document).width() <= 816) {
        navigateToSection(e, 700);
    }
    else {
        var attrEl = $(e.target).attr("href");
        var links = $(attrEl);
        if (links) {
            var top_2 = (_a = links.offset()) === null || _a === void 0 ? void 0 : _a.top;
            if (top_2) {
                $("html, body").animate({ scrollTop: top_2 - 40 }, 700, function () { });
            }
        }
    }
});
$(".view-portfolio").click(function (e) {
    e.preventDefault();
    navigateToSection(e, 700);
});
// #aboutMe section's wrapping for responsiveness reasons
// $(".about-wrapper").height($(".about-wrapper .container").height())
var currentSectionCount = "1";
$("#wrapper > section").each(function (index, el) {
    $(window).scroll(function (e) {
        var sections = $("#wrapper > section");
        var coordinates = sections.eq(index).offset();
        if (!sections && !coordinates) {
            return;
        }
        if (coordinates) {
            if ($(window).scrollTop() >= coordinates.top) {
                var sectionId = $(el).attr("data-section");
                if (sectionId) {
                    currentSectionCount = sectionId;
                    $(".section-id").html("# 0" + currentSectionCount);
                }
            }
        }
    });
});
if ($(window).width() >= 1024) {
    var container_1 = document.createElement("div");
    var el = $(container_1).addClass("container");
    $(".aboutViewport").wrap(el);
}
function setBackgroundImgtoAll() {
    var images = document
        .querySelectorAll("[data-src]")
        .forEach(function (image) {
        var url = $(image).attr("data-src");
        setBackgroundImg(image, url);
    });
}
function setBackgroundImg(el, url) {
    $(el).css("background-image", "url(" + url + ")");
}
function navigateToSection(e, speed) {
    var attrs = $(e.target).attr("href");
    var links = $(attrs);
    var navHeight = $(".top-menu").outerHeight();
    var padding = 0;
    if (links) {
        var outerh = links === null || links === void 0 ? void 0 : links.outerHeight();
        var h_1 = links === null || links === void 0 ? void 0 : links.height();
        padding = outerh - h_1;
    }
    e.preventDefault();
    if ($(document).width() >= 1024)
        navHeight = 0;
    else
        navHeight = $(".top-menu").outerHeight();
    $(window).resize(function () {
        if ($(document).width() >= 1024)
            navHeight = 0;
        else
            navHeight = $(".top-menu").outerHeight();
    });
    var autoScroll;
    var coordinates = links.offset();
    if (links && coordinates) {
        if ($(e.target).attr("href") === "#slogan") {
            $("html, body").animate({ scrollTop: coordinates.top - navHeight }, speed, function () {
                autoScroll = true;
            });
        }
        else {
            $("html, body").animate({
                scrollTop: coordinates.top - padding - navHeight / 2
            }, speed, function () {
                autoScroll = true;
            });
        }
    }
    return false;
}
