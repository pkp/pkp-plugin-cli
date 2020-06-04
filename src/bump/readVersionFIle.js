/**
 * @file src/bump/readVersionFile.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Helper for reading the version of the plugin
 *
 * This helper is used by the bump command (pkp-plugin bump) to read the current version of the plugin
 * from version.xml.
 */
const { readFile } = require('../utils/files')

const readVersionFile = async fileName => {
  try {
    const file = await readFile('./version.xml')
    return file
  } catch (err) {
    if (err.code === 'ENOENT') {
      error(
        'Could not find version.xml. Make sure to run the command in the root of your plugin.'
      )
      return
    }
    throw err
  }
}

module.exports = readVersionFile
