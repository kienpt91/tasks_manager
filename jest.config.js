const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!app/layout.tsx',
    '!app/page.tsx',
    '!lib/supabase/middleware.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 65,
      functions: 70,
      lines: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
