/**
 * @file src/version.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Prints the current version of the command line tool (run with pkp-plugin version)
 */
const { info } = require('./utils/log')

module.exports = args => {
  const packageFile = require('../package.json')
  info(packageFile.version)
}
