"use strict";
const _ = require("lodash");
const fs = require("fs");

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const unSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

// Remove all null or undefined value in object
const removeNestedNullUndefined = (obj) => {
    for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) delete obj[key];
        else if (typeof obj[key] === "object") {
            removeNestedNullUndefined(obj[key]);
        }
    }
};

const NestedObjectParser = (obj) => {
    const result = {};
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object") {
            const response = NestedObjectParser(obj[key]);
            Object.keys(response).forEach((res_k) => {
                result[`${key}.${res_k}`] = response[res_k];
            });
        } else {
            result[key] = obj[key];
        }
    });
    return result;
};

const deleteFileByRelativePath = (filePath) => {
    if (!filePath) return;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File does not exist or cannot be accessed");
            return;
        }

        // Delete the file
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return;
            }

            console.log("File deleted successfully");
        });
    });
};

function createDateFromString(date) {
    // date ::::30/04/2024
    const parts = date.split("/");
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Months are 0-indexed
    const year = parseInt(parts[2]);

    return new Date(year, month, day);
}

function removeExtInFileName(filename) {
    let split = filename.split(".");
    let ext = split.at(-1);
    return filename.replaceAll(`.${ext}`, "");
}

function deleteRedundancyKey(raw, standard) {
    Object.keys(raw).forEach((key) => {
        if (!Object.keys(standard).includes(key)) delete raw[key];
    });
}

// haversine
function distanceBetweenTwoPoints(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers

    const latDistance = toRadians(lat2 - lat1);
    const lonDistance = toRadians(lon2 - lon1);
    const a =
        Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(lonDistance / 2) *
            Math.sin(lonDistance / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(2);
}

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

// move it to database
function findShippingFee(distance) {
    if (distance < 2) return 16000;
    else if (distance < 6) return 20000;
    else if (distance < 8) return 22000;
    else if (distance < 12) return 28000;
    else if (distance < 20) return 40000;
    else return 48000;
}

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeNestedNullUndefined,
    NestedObjectParser,
    deleteFileByRelativePath,
    removeExtInFileName,
    createDateFromString,
    deleteRedundancyKey,
    distanceBetweenTwoPoints,
    findShippingFee,
};
