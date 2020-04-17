const shell = require('shelljs')
const extractReleases = require('./extract-releases')

module.exports = async args => {
  // Extract the plugins information from an xml file
  const extractedDataFile = await extractReleases(args)

  // Validate the MD5 checksum for all releases
  const command = `bash ${__dirname}/check-md5.sh < ${extractedDataFile}`
  const code = shell.exec(command).code

  // Delete intermediate file
  shell.rm(extractedDataFile)

  if (code !== 0) {
    shell.echo('Error: validation of releases failed')
    shell.exit(1)
  }
}
