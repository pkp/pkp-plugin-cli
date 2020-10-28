/**
 * @file src/help.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 *
 * @brief Prints the help of the command line (when running pkp-plugin help)
 */
const chalk = require('chalk')
const { log, warn, info } = require('./utils/log')

module.exports = args => {
  log('')
  info('Welcome to PKP Plugins Registry CLI.')
  log('')
  warn('validate-all-releases --input file/input.xml')
  log(
    'Extracts all releases for all plugins from a plugins.xml file and validates their MD5 checksum (used internally by the CI tool)'
  )
  log('')
  warn('generate-site --input file/input.xml')
  log(
    'Generates a website reflecting the state of plugins directory (used internally by the CI tool)'
  )
  log('')
  warn('validate-new-release')
  log('Validates the new releases added to a plugin.xml file. This command needs to run within a Git checkout of the plugin gallery XML repository (used internally by the CI tool)')
  log('')
  warn('bump')
  log('Bumps version.xml and update release date')
  log('')
  warn('release pluginName --newversion 2.1.1')
  log(
    'Creates a release of the package (commits version.xml, creates a release package, pushes it, create a release draft and uploads asset to it)'
  )
  log('')
  warn('GITHUB_TOKEN=MY_PERSONAL_TOKEN pkp-plugin bump')
  warn(`${chalk.dim('or Add your personal token to an environment variable called GITHUB_TOKEN')}`)
  log(`You can provide your Github personal access token to the bump and release commands by prefixing them with ${chalk.white('GITHUB_TOKEN=xxxx ')} to avoid being prompted to enter it`)

  log('')
  log(`${chalk.underline('Setting up Github Personal Access Token')}`)
  log(
    `A Personal Access Token is required if you want to upload a release to Github using the tool. To setup a Personal Token, follow the procedure described here: ${
    chalk.underline(
      'https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line'
    )
    }`
  )
}
