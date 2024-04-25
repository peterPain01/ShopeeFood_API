const fs = require("fs");


module.exports = {
    isValidHourMin(time) {
        let [hour, min] = time.split(":");
        if (hour < 0 || hour > 24 || min < 0 || min > 60) return false;
        return true;
    },

    isValidOpenCloseHour(open, close) {
        if (!this.isValidHourMin(open) || !this.isValidHourMin(close)) {
            return false;
        }
        let [hourOpen, minOpen] = open.split(":");
        let [hourClose, minClose] = close.split(":");

        if (hourOpen > hourClose) return false;
        if (hourOpen === hourClose && minOpen > minClose) return false;

        return true;
    },

   
};
