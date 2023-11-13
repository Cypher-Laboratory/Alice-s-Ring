export const noEmptyMsg = new Error("Cannot sign empty message");
export const noEmptyRing = new Error("Ring cannot be empty");
export const invalidSignature = new Error("Invalid signature");

export const computationError = (data?: string) => {
  if (data) return new Error(`Computation error: ${data}`);
  return new Error("Computation error");
};

/**
 * @param l1 - name of first parameter
 * @param l2 - name of second parameter
 * @returns Error object
 */
export const lengthMismatch = (l1?: string, l2?: string) => {
  try {
    if (l1 && l2) return new Error(`${l1} length does not match ${l2} length`);
    return new Error("Length mismatch");
  } catch (e) {
    throw invalidParams;
  }
};

export const noDuplicates = (varName?: string) => {
  if (varName) return new Error(`Duplicates found in ${varName}`);
  return new Error("No duplicates allowed");
};

/* -------------NUMBER------------- */
/**
 * @param data - var name
 * @param min - min value
 * @returns Error object
 */
export const tooSmall = (data?: string, min?: number | bigint) => {
  if (data && min)
    return new Error(`${data} value should be greater than ${min}`);
  return new Error("Number too small");
};
/**
 * @param data - var name
 * @param max - max value
 * @returns Error object
 */
export const tooBig = (data?: string, max?: number | bigint) => {
  if (data && max) return new Error(`${data} value should be less than ${max}`);
  return new Error("Number too big");
};

/* -------------PARAMS------------- */
export const invalidParams = (data?: string) => {
  if (data) return new Error(`Invalid param: ${data}`);
  return new Error("Invalid parameters");
};
export const missingParams = (data = "") => {
  return new Error(`Missing parameters: ${data}`);
};
export const invalidJson = (data?: string | unknown) => {
  if (data) return new Error(`Invalid JSON: ${data}`);
  return new Error("Invalid JSON");
};
export const invalidBase64 = (data?: string) => {
  if (data) return new Error(`Invalid base64: ${data}`);
  return new Error("Invalid base64");
};

/* -------------POINTS------------- */
export const invalidPoint = (data?: string) => {
  if (data) return new Error(`Invalid point: ${data}`);
  return new Error("Invalid point");
};
export const notOnCurve = (data?: string) => {
  if (data) return new Error(`Point is not on curve: ${data}`);
  return new Error("Invalid point: not on curve");
};
export const invalidCoordinates = (data?: string) => {
  if (data) return new Error(`Invalid coordinates: ${data}`);
  return new Error("Invalid coordinates");
};

/* -------------CURVE------------- */
export const unknownCurve = (data?: string) => {
  if (data) return new Error(`Unknown curve: ${data}`);
  return new Error("Unknown curve");
};
export const invalidCurve = (data?: string) => {
  if (data) return new Error(`Invalid curve: ${data}`);
  return new Error("Invalid curve");
};
export const differentCurves = (data?: string) => {
  if (data) return new Error(`Different curves: ${data}`);
  return new Error("Different curves");
};
export const curveMismatch = (data?: string) => {
  if (data) return new Error(`Curve mismatch: ${data}`);
  return new Error("Curve mismatch");
};

/* -------------RESPONSES------------- */
export const noEmptyResponses = new Error("Responses cannot be empty");
export const invalidResponses = new Error("At least one response is not valid");

/* -------------RING------------- */
export const invalidRing = (data?: string) => {
  if (data) return new Error(`Invalid ring: ${data}`);
  return new Error("Invalid ring");
};
