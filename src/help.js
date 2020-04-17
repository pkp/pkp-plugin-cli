const chalk = require('chalk')

module.exports = args => {
  console.log('Welcome to PKP Plugins Registry CLI!')
  console.log('')
  console.log(
    chalk.white(
      chalk.green('validate-releases --input file/input.xml'),
      ' extracts all releases for all plugins from a plugins.xml file and validates their MD5 checksum (used internally by the CI tool)'
    )
  )
  console.log(
    chalk.white(
      chalk.green('validate-new-release'),
      ' validates the new releases added to a plugin.xml file (used internally by the CI tool)'
    )
  )
}
