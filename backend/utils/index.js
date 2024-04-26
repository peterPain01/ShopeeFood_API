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

function removeExtInFileName(filename) {
    let split = filename.split(".");
    let ext = split.at(-1);
    return filename.replaceAll(`.${ext}`, "");
}
module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeNestedNullUndefined,
    NestedObjectParser,
    deleteFileByRelativePath,
    removeExtInFileName
};
