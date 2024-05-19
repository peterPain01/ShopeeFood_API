const fs = require("fs");

function isValidHourMin(time: string): boolean {
    let [hour, min] = time.split(":").map(Number);

    if (hour < 0 || hour > 24 || min < 0 || min > 60) return false;
    return true;
}

function isValidOpenCloseHour(open: string, close: string): boolean {
    if (!isValidHourMin(open) || !isValidHourMin(close)) {
        return false;
    }
    let [hourOpen, minOpen] = open.split(":").map(Number);
    let [hourClose, minClose] = close.split(":").map(Number);

    if (hourOpen > hourClose) return false;
    if (hourOpen === hourClose && minOpen > minClose) return false;

    return true;
}

module.exports = { isValidOpenCloseHour };
