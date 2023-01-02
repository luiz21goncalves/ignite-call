const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageReporters: ['lcov', 'text', 'text-summary'],
  collectCoverageFrom: [
    './src/**/*.{ts,tsx}',
    '!./src/**/*.stories.{tsx,mdx}',
    '!./src/**/*.d.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)
