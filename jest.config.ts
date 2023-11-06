import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/deprecated-test/",
  ],
};

export default config;
