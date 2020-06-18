/**
 * @file src/validate-all-releases/index.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Entry point for validate-all-releases command
 *
 * This command (used by CI on Plugin Gallery repository) runs several checks on plugins.xml file:
 * - Find all plugins and their releases in the XML file
 * - Downloads all releases
 * - Validates their MD5 checksum
 */
const shell = require('shelljs')
const validateXml = require('../utils/plugins/validateXml')
const extractReleases = require('../utils/plugins/extractAllReleasesFromXml')
const { writeFile } = require('../utils/files')
const { info, error, debug } = require('../utils/log')
const execa = require('execa')

module.exports = async args => {
  try {
    const inputFilePath = getFilePathFromArgs(args)

    await validateXml(inputFilePath)

    debug('Extracting the plugins info from xml file')
    const releases = await extractReleases(inputFilePath)

    debug('Write releases data in a CSV file to be consumed by next bash script')
    let packagesWithSums = ''
    releases.forEach(({ expectedMd5Sum, url }) => {
      packagesWithSums += expectedMd5Sum + ',' + url + '\n'
    })

    debug('Writing release data into temp file')
    const { stdout: extractedDataFile } = await execa('mktemp', `${Date.now()}XXXXXXXX`)
    await writeFile(extractedDataFile, packagesWithSums)

    // use batch script to validate the MD5 checksum for all releases
    // (this was a lot faster than doing the download in Node)
    info(`Validating MD5 sum for all ${releases.length} releases`)
    const command = `bash ${__dirname}/check-md5.sh < ${extractedDataFile}`
    const code = shell.exec(command).code

    // Delete intermediate file
    shell.rm(extractedDataFile)

    if (code !== 0) {
      throw 'Error: Bash script performing md5 validation returned an error'
    }
  } catch (err) {
    error(err)
    shell.exit(1)
  }
}

const getFilePathFromArgs = args => {
  let { input } = args
  if (!input) {
    input = args._[1]
  }

  if (!input) {
    throw `No path provided. Run "pkp-plugin help" for information on the command.`
  }

  return input
}
