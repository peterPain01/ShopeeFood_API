"use strict";

const _ = require("lodash");
const fs = require("fs");

export {};

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
const removeNestedNullUndefined = (obj: Object) => {
    for (const key in obj) {
        const keyTyped = key as keyof typeof obj;

        if (obj[keyTyped] === null || obj[keyTyped] === undefined)
            delete obj[keyTyped];
        else if (typeof obj[keyTyped] === "object") {
            removeNestedNullUndefined(obj[keyTyped]);
        }
    }
};

function isEmptyObject(obj: object) {
    return (
        obj !== null && typeof obj === "object" && Object.keys(obj).length === 0
    );
}

const NestedObjectParser = (obj: object) => {
    const result = {};
    Object.keys(obj).forEach((key) => {
        type ObjectKey = keyof typeof obj;
        type ResultKey = keyof typeof result;

        if (typeof obj[key as ObjectKey] === "object") {
            const response = NestedObjectParser(obj[key as ObjectKey]);
            Object.keys(response).forEach((res_k) => {
                type ResponseKey = keyof typeof response;
                result[`${key}.${res_k}` as ResultKey] =
                    response[res_k as ResponseKey];
            });
        } else {
            result[key as ResultKey] = obj[key as ObjectKey];
        }
    });
    return result;
};

const deleteFileByRelativePath = (filePath: string) => {
    if (!filePath) return;
    fs.access(filePath, fs.constants.F_OK, (err: Error) => {
        if (err) {
            console.error("File does not exist or cannot be accessed");
            return;
        }

        // Delete the file
        fs.unlink(filePath, (err: Error) => {
            if (err) {
                console.error("Error deleting file:", err);
                return;
            }

            console.log("File deleted successfully");
        });
    });
};

function createDateFromString(date: string) {
    // date ::::30/04/2024
    const parts = date.split("/");
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Months are 0-indexed
    const year = parseInt(parts[2]);

    return new Date(year, month, day);
}

function removeExtInFileName(filename: string): string {
    let split = filename.split(".");
    let ext = split.at(-1);
    return filename.replaceAll(`.${ext}`, "");
}

function deleteRedundancyKey(raw: object, standard: object) {
    type ObjectKey = keyof typeof raw;
    Object.keys(raw).forEach((key) => {
        if (!Object.keys(standard).includes(key)) delete raw[key as ObjectKey];
    });
}

// haversine
function distanceBetweenTwoPoints(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
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

    return parseInt(distance.toFixed(2));
}

function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

// move it to database
function findShippingFee(distance: number): number {
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
    isEmptyObject,
};
