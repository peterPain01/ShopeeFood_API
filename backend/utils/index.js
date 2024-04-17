"use strict";
const _ = require("lodash");

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

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeNestedNullUndefined,
    NestedObjectParser
};
