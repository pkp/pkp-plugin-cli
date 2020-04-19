const shell = require('shelljs')
const extractReleases = require('../utils/plugins/extractAllReleasesFromXml')
const { writeFile } = require('../utils/files')
const { info, error } = require('../utils/log')

/**
 * Entry point for validate-all-releases command
 */
module.exports = async args => {
  try {
    const inputFilePath = getFilePathFromArgs(args)

    // Extract the plugins information from an xml file
    const releases = await extractReleases(inputFilePath)

    // Write releases data in a CSV file to be consumed by next bash script
    const extractedDataFile = `${__dirname}/${Date.now()}.temp`
    let packagesWithSums = ''
    releases.forEach(({ expectedMd5Sum, url }) => {
      packagesWithSums += expectedMd5Sum + ',' + url + '\n'
    })
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
