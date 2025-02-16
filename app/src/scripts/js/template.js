"use strict";
exports.__esModule = true;
exports.applyTemplate = void 0;
var DATE_BORN = new Date("2004-07-02");
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var applyTemplate = function () {
    var ageContainer = document.getElementById("dynamic-age");
    if (ageContainer) {
        var age = currentYear - DATE_BORN.getFullYear();
        var monthDifference = currentDate.getMonth() - DATE_BORN.getMonth();
        var dayDifference = currentDate.getDate() - DATE_BORN.getDate();
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0))
            age--;
        ageContainer.textContent = String(age);
    }
    var dateContainer = document.getElementById("dynamic-year");
    if (dateContainer)
        dateContainer.textContent = String(currentYear);
};
exports.applyTemplate = applyTemplate;
