module.exports = {
  roots: ["./test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["./**/*.steps.ts", "./**/*.test.ts"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts}"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: [6133],
      },
    },
  },
};
