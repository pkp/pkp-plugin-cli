/**
 * @file src/validate-new-release/index.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 *
 * @brief Entry point for validate-new-release command
 *
 * This command runs on Git checkout of Plugin Gallery repository
 * and validates new releases added to the file. Some of the checks:
 * - Extracts the release and md5 data from diff
 * - Downloads the package specified in the release
 * - Validates the MD5 of the package downloaded
 * - Checks the contents of the tar file of the package are valid
 */
const shell = require('shelljs')
const path = require('path')
const downloadPackage = require('../utils/downloadPackage')
const extractReleaseDataFromDiff = require('./extractReleaseDataFromDiff')
const checksumFile = require('../utils/checkSumFile')
const validateTarContents = require('./validateTarContents')
const { error, success, info } = require('../utils/log')

/**
 * Entry point for validate-new-release command
 */
module.exports = async () => {
  try {
    info('Checking new release')
    const command = shell.exec('git diff origin/main | grep ^+[^+]')
    const changedLines = command.stdout

    // Extract release, md5 data from diff
    const {
      package: packageUrl,
      md5: expectedMD5
    } = extractReleaseDataFromDiff(changedLines)

    if (!expectedMD5 || !packageUrl) {
      if (changedLines) {
        info('No new packages were added to plugins.xml. The tool will not run further tests.')
        return shell.exit(0)
      }
      error(
        'No new releases could be detected in the current folder. Make sure you run the command on a Git repo that has plugins.xml.'
      )
      return shell.exit(1)
    }
    info(`Package url: ${packageUrl}. Expected MD5: ${expectedMD5}`)

    // Download package
    const downloadedFileName = path.join(__dirname, '/downloaded_package.tar.gz')
    await downloadPackage(packageUrl, downloadedFileName)

    // Calculate MD5 of downloaded file
    const md5 = await checksumFile(downloadedFileName)

    if (md5 === expectedMD5) {
      success('The MD5 of the downloaded file is correct')
    } else {
      error(
        `The MD5 of the downloaded is incorrect. Expected ${expectedMD5}, Actual ${md5}`
      )
      shell.rm(downloadedFileName)
      shell.exit(1)
    }

    // validate contents of tar file
    await validateTarContents({ tarFile: downloadedFileName, md5, packageUrl })

    info('Deleting temporary file')
    shell.rm(downloadedFileName)

    success('Validation succeeded.')
  } catch (err) {
    error(err)
    shell.exit(1)
  }
}
