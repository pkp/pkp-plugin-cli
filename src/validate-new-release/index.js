const shell = require('shelljs')
const downloadPackage = require('../utils/downloadPackage')
const extractReleaseDataFromDiff = require('./extractReleaseDataFromDiff')
const checksumFile = require('../utils/checkSumFile')
const validateTarContents = require('./validateTarContents')
const { error, success, info } = require('../utils/log')

module.exports = async args => {
  try {
    info(`Checking new release`)
    const diffFile = __dirname + '/diff.temp'
    const command = shell.exec(`git diff origin/master | grep ^+[^+]`)
    const changedLines = command.stdout

    // Extract release, md5 data from diff
    const {
      package: packageUrl,
      md5: expectedMD5
    } = extractReleaseDataFromDiff(changedLines)

    if (!expectedMD5 || !packageUrl) {
      error(
        'No new releases could be detected in the diff of the specified repo.'
      )
      return shell.exit(1)
    }
    info(`Package url: ${packageUrl}`)
    info(`MD5: ${expectedMD5}`)

    // Downlaod package
    const downloadedFileName = __dirname + '/downloaded_package.tar.gz'
    await downloadPackage(packageUrl, downloadedFileName)

    // Calculate MD5 of downloaded file
    const md5 = await checksumFile(downloadedFileName)

    if (md5 === expectedMD5) {
      success(`The MD5 of the downloaded file is correct`)
    } else {
      error(
        `The MD5 of the downloaded is incorrect. Expected ${expectedMD5}, Actual ${md5}`
      )
      shell.rm(downloadedFileName)
      shell.exit(1)
    }

    // check contents of tar file
    await validateTarContents({ tarFile: downloadedFileName, md5, packageUrl })

    info('Deleting temporary file')
    shell.rm(downloadedFileName)

    success('Validation succeeded.')
  } catch (err) {
    error(err)
    shell.exit(1)
  }
}
