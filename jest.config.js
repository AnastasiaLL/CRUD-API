module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  
 
  moduleNameMapper: {
    '^uuid$': '<rootDir>/__tests__/__mocks__/uuid.ts',
  },
  
  setupFiles: ['dotenv/config'],
  verbose: true,

  testTimeout: 10000, 
  maxWorkers: 1, 
};