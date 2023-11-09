import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/deprecated-test/",
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};

export default config;
