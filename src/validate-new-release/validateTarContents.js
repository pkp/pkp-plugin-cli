/**
 * @file src/validate-new-release/validateTarContents.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 *
 * @brief Helper function to validate the conents of package
 *
 * Validates the contents of tarball, namely it checks whether a downloaded package
 * contains one folder matching the plugin name
 */
const shell = require('shelljs')
const { log } = require('../utils/log')
const extractAllReleasesFromXml = require('../utils/plugins/extractAllReleasesFromXml')

module.exports = async (
  { tarFile, md5, packageUrl },
  pluginsFilePath = './plugins.xml'
) => {
  const releases = await extractAllReleasesFromXml(pluginsFilePath)
  log('Finding matching plugin for this release...')
  const matchingRelease = releases.find(release => {
    return release.expectedMd5Sum === md5 && release.url === packageUrl
  })
  log(`Found plugin "${matchingRelease.plugin.name}"`)

  const tarCommand = shell.exec(`tar -tf ${tarFile}`)
  if (tarCommand.code !== 0) throw new Error('Error opening tar file')
  tarCommand
    .trim()
    .split(/\n/)
    .forEach(line => {
      if (!line.match(new RegExp(`^${matchingRelease.plugin.name}/`, 'g'))) {
        throw new Error(`Validation of tar file failed: There should be only one folder in the root of the extracted file named "${matchingRelease.plugin.name}"`)
      }
    })
}
