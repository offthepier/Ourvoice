module.exports = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: "tests/coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*test.ts"],
  moduleDirectories: ["node_modules", "src"],
  rootDir: "./", // ***** CHANGE "rootDir": "src" to "rootDir": "./"
  modulePaths: ["<rootDir>"], // ***** ADD "modulePaths": ['<rootDir>'],
  globalTeardown: "<rootDir>/jest.cleanup.js",
  silent: true,
};
