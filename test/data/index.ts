import * as jsonRS from "../data/jsonSignatures.json";

export { jsonRS };
export * from "./curves";
export * from "./message";
export * from "./points";

export const base64Regex =
  // eslint-disable-next-line no-useless-escape
  /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
