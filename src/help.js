const chalk = require('chalk')

module.exports = args => {
  console.log('Welcome to PKP Plugins Registry CLI!')
  console.log('')
  console.log(
    chalk.white(
      chalk.green(
        'validate-releases --input file/input.xml --output file/output'
      ),
      ' extracts all releases for all plugins from a plugins.xml file and validates their MD5 checksum (used internally by the CI tool)'
    )
  )
}
