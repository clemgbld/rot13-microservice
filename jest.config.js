module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/setupJest.ts"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
