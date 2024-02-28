module.exports = {
  preset: 'jest-preset-angular',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@stomp/rx-stomp)'],
  setupFiles: ['./projects/ngrx-signals-storage/setup-jest.ts']
}
