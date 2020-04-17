const chalk = require('chalk')

module.exports = args => {
  const package = require('../package.json')
  console.log(package.version)
}
