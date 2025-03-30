module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules'],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  coverageReporters: ['text', 'cobertura'],
  moduleNameMapper: {
    '^obsidian$': '<rootDir>/src/tests/__mocks__/obsidian.ts',
  },
};
