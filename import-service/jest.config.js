module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '@functions/(.*)': ['<rootDir>/src/functions/$1'],
    '@libs/(.*)': ['<rootDir>/src/libs/$1'],
  },
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
};
