const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  modulePathIgnorePatterns: ["<rootDir>/src/aws"],
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/assets",
    "<rootDir>/src/pages/_app.tsx",
    "<rootDir>/src/aws/S3Service/S3UploadService.ts",
    "\\.ts$",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/assets",
    "/src/context",
    "/src/hoc",
    "/test/coverage",
    "<rootDir>/src/pages/_app.tsx",
    "\\.ts$",
  ],
  collectCoverageFrom: ["src/**/*.tsx"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/themes/(.*)$": "<rootDir>/src/themes/$1",
    "^@/assets/(.*)$": "<rootDir>/src/assets/$1",
    "^@/aws/(.*)$": "<rootDir>/src/aws/$1",
    "^@/context/(.*)$": "<rootDir>/src/context/$1",
    "^@/styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@/service/(.*)$": "<rootDir>/src/service/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/test/(.*)$": "<rootDir>/test/$1",
    "^uuid$": require.resolve("uuid"),
    "^lodash-es$": require.resolve("lodash"),
  },
  silent: true, // *****
};

module.exports = createJestConfig(customJestConfig);
