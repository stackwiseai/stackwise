module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/', '<rootDir>/out/', '<rootDir>/src/test/suite'],
};
