const shell = require('shelljs')
const extractReleases = require('../utils/plugins/extract-releases-from-xml')
const { writeFile } = require('../utils/files')
const { info } = require('../utils/log')

module.exports = async args => {
  // Extract the plugins information from an xml file
  const releases = await extractReleases(args.input)

  // Write releases data in a CSV file to be consumed by next bash script
  const extractedDataFile = `${__dirname}/${Date.now()}.temp`
  let packagesWithSums = ''
  releases.forEach(({ expectedMd5Sum, url }) => {
    packagesWithSums += expectedMd5Sum + ',' + url + '\n'
  })
  await writeFile(extractedDataFile, packagesWithSums)

  // Validate the MD5 checksum for all releases
  info(`Validating MD5 sum for all ${releases.length} releases`)
  const command = `bash ${__dirname}/check-md5.sh < ${extractedDataFile}`
  const code = shell.exec(command).code

  // Delete intermediate file
  shell.rm(extractedDataFile)

  if (code !== 0) {
    shell.echo('Error: validation of releases failed')
    shell.exit(1)
  }
}
