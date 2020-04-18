const { info } = require('./utils/log')

module.exports = args => {
  const package = require('../package.json')
  info(package.version)
}
