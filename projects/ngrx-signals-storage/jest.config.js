process.env.TZ = 'Europe/Amsterdam'

module.exports = {
  preset: 'jest-preset-angular',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@stomp/rx-stomp)']
}
