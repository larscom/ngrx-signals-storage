module.exports = {
  preset: 'jest-preset-angular',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@stomp/rx-stomp)'],
  setupFiles: ['./projects/ngrx-signals-storage/setup-jest.ts'],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/ngrx-signals-storage/package.json',
    '<rootDir>/projects/ngrx-signals-storage/package.json'
  ]
}
