process.env.TZ = 'Europe/Amsterdam'

module.exports = {
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@stomp/rx-stomp)']
}
