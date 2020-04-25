const chalk = require('chalk')
const { log, warn, info } = require('./utils/log')

module.exports = args => {
  log('')
  info('Welcome to PKP Plugins Registry CLI!')
  log('')
  warn('validate-all-releases --input file/input.xml'),
    log(
      'Extracts all releases for all plugins from a plugins.xml file and validates their MD5 checksum (used internally by the CI tool)'
    )
  log('')
  warn('validate-new-release')
  log(
    'Validates the new releases added to a plugin.xml file. This command needs to run within a Git checkout of the plugin gallery XML repository (used internally by the CI tool)'
  )
  log('')
  warn('bump')
  log('Bumps version.xml and update release date')
  log('')
  warn('release')
  log(
    'Creates a release of the package (commits version.xml, creates a release package and pushes it)'
  )
}
