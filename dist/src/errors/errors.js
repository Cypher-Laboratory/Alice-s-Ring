"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidRing = exports.invalidResponses = exports.noEmptyResponses = exports.curveMismatch = exports.differentCurves = exports.invalidCurve = exports.unknownCurve = exports.invalidCoordinates = exports.notOnCurve = exports.invalidPoint = exports.invalidBase64 = exports.invalidJson = exports.missingParams = exports.invalidParams = exports.tooBig = exports.tooSmall = exports.noDuplicates = exports.lengthMismatch = exports.computationError = exports.invalidSignature = exports.noEmptyRing = exports.noEmptyMsg = void 0;
exports.noEmptyMsg = new Error("Cannot sign empty message");
exports.noEmptyRing = new Error("Ring cannot be empty");
exports.invalidSignature = new Error("Invalid signature");
const computationError = (data) => {
    if (data)
        return new Error(`Computation error: ${data}`);
    return new Error("Computation error");
};
exports.computationError = computationError;
/**
 * @param l1 - name of first parameter
 * @param l2 - name of second parameter
 * @returns Error object
 */
const lengthMismatch = (l1, l2) => {
    try {
        if (l1 && l2)
            return new Error(`${l1} length does not match ${l2} length`);
        return new Error("Length mismatch");
    }
    catch (e) {
        throw exports.invalidParams;
    }
};
exports.lengthMismatch = lengthMismatch;
const noDuplicates = (varName) => {
    if (varName)
        return new Error(`Duplicates found in ${varName}`);
    return new Error("No duplicates allowed");
};
exports.noDuplicates = noDuplicates;
/* -------------NUMBER------------- */
/**
 * @param data - var name
 * @param min - min value
 * @returns Error object
 */
const tooSmall = (data, min) => {
    if (data && min)
        return new Error(`${data} value should be greater than ${min}`);
    return new Error("Number too small");
};
exports.tooSmall = tooSmall;
/**
 * @param data - var name
 * @param max - max value
 * @returns Error object
 */
const tooBig = (data, max) => {
    if (data && max)
        return new Error(`${data} value should be less than ${max}`);
    return new Error("Number too big");
};
exports.tooBig = tooBig;
/* -------------PARAMS------------- */
const invalidParams = (data) => {
    if (data)
        return new Error(`Invalid param: ${data}`);
    return new Error("Invalid parameters");
};
exports.invalidParams = invalidParams;
const missingParams = (data = "") => {
    return new Error(`Missing parameters: ${data}`);
};
exports.missingParams = missingParams;
const invalidJson = (data) => {
    if (data)
        return new Error(`Invalid JSON: ${data}`);
    return new Error("Invalid JSON");
};
exports.invalidJson = invalidJson;
const invalidBase64 = (data) => {
    if (data)
        return new Error(`Invalid base64: ${data}`);
    return new Error("Invalid base64");
};
exports.invalidBase64 = invalidBase64;
/* -------------POINTS------------- */
const invalidPoint = (data) => {
    if (data)
        return new Error(`Invalid point: ${data}`);
    return new Error("Invalid point");
};
exports.invalidPoint = invalidPoint;
const notOnCurve = (data) => {
    if (data)
        return new Error(`Point is not on curve: ${data}`);
    return new Error("Invalid point: not on curve");
};
exports.notOnCurve = notOnCurve;
const invalidCoordinates = (data) => {
    if (data)
        return new Error(`Invalid coordinates: ${data}`);
    return new Error("Invalid coordinates");
};
exports.invalidCoordinates = invalidCoordinates;
/* -------------CURVE------------- */
const unknownCurve = (data) => {
    if (data)
        return new Error(`Unknown curve: ${data}`);
    return new Error("Unknown curve");
};
exports.unknownCurve = unknownCurve;
const invalidCurve = (data) => {
    if (data)
        return new Error(`Invalid curve: ${data}`);
    return new Error("Invalid curve");
};
exports.invalidCurve = invalidCurve;
const differentCurves = (data) => {
    if (data)
        return new Error(`Different curves: ${data}`);
    return new Error("Different curves");
};
exports.differentCurves = differentCurves;
const curveMismatch = (data) => {
    if (data)
        return new Error(`Curve mismatch: ${data}`);
    return new Error("Curve mismatch");
};
exports.curveMismatch = curveMismatch;
/* -------------RESPONSES------------- */
exports.noEmptyResponses = new Error("Responses cannot be empty");
exports.invalidResponses = new Error("At least one response is not valid");
/* -------------RING------------- */
const invalidRing = (data) => {
    if (data)
        return new Error(`Invalid ring: ${data}`);
    return new Error("Invalid ring");
};
exports.invalidRing = invalidRing;
