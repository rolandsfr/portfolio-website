"use strict";
exports.__esModule = true;
exports.cursorSetup = void 0;
var gsap_1 = require("gsap");
var cursorSetup = function (speed) {
    var cursor = Array.from(document.getElementsByClassName("cursor"))[0];
    var mouseX = 0;
    var mouseY = 0;
    var cursorX = 0;
    var cursorY = 0;
    var animateCursor = function () {
        var distX = mouseX - cursorX;
        var distY = mouseY - cursorY;
        cursorX = cursorX + distX * speed;
        cursorY = cursorY + distY * speed;
        cursor.style.left = cursorX + "px";
        cursor.style.top = cursorY + "px";
        requestAnimationFrame(animateCursor);
    };
    animateCursor();
    document.addEventListener("mousemove", function (e) {
        cursor.classList.add("fadeIn");
        mouseX = e.pageX - 25;
        mouseY = e.clientY - 125;
    });
    $("body").on("mouseover", ".hoverable, a", function (e) {
        cursor.classList.add("hovered");
        gsap_1["default"].to(".cursor", {
            scale: 0.8,
            duration: 0.6
        });
    });
    $("body").on("mouseleave", ".hoverable, a", function (e) {
        cursor.classList.remove("hovered");
        gsap_1["default"].to(".cursor", {
            scale: 1,
            duration: 0.6
        });
    });
};
exports.cursorSetup = cursorSetup;
