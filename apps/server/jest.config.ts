import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  setupFiles: [],
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
    // Mock a heavy ESM auth library to avoid pulling transitive ESM deps like 'jose' during unit tests
    "^better-auth$": "<rootDir>/test/__mocks__/better-auth.ts",
    "^better-auth/(.*)$": "<rootDir>/test/__mocks__/better-auth/$1.ts",
  },
  // Transform both TS and JS so ESM dependencies in node_modules (e.g. jose) are handled
  transform: {
    "^.+\\.(ts|tsx|js|mjs|cjs)$": [
      "ts-jest",
      {
        // Override TS compiler options for the transformer
        tsconfig: {
          allowJs: true,
          module: "ESNext",
          target: "ES2022",
          moduleResolution: "Bundler",
        },
        useESM: true,
      },
    ],
  },
  // Treat TS and MJS as ESM ('.js' is inferred per the nearest package.json and must not be listed)
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  verbose: true,
  // Allow transforming specific ESM packages inside node_modules
  transformIgnorePatterns: ["node_modules/(?!(better-auth|@noble|jose)/)"],
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
};

export default config;
