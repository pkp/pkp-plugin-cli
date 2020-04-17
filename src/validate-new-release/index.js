const shell = require('shelljs')
const chalk = require('chalk')
const downloadPackage = require('./download-package')
const extractReleaseData = require('./extract-release-data')
const checksumFile = require('./checkSumFile')

module.exports = async args => {
  console.log(chalk.blueBright(`Checking new release`))
  const diffFile = __dirname + '/diff.temp'
  const command = shell.exec(`git diff origin/master | grep ^+[^+]`)
  const changedLines = command.stdout

  // Extract release, md5 data from diff
  const { package: packageUrl, md5: expectedMD5 } = extractReleaseData(
    changedLines
  )
  console.log(chalk.blueBright(`Package url: ${packageUrl}`))
  console.log(chalk.blueBright(`MD5: ${expectedMD5}`))

  // Downlaod package
  const downloadedFileName = __dirname + '/downloaded_package.tar.gz'
  await downloadPackage(packageUrl, downloadedFileName)

  // Calculate MD5 of downloaded file
  const md5 = await checksumFile(downloadedFileName)

  if (md5 === expectedMD5) {
    console.log(chalk.greenBright(`The MD5 of the downloaded file is correct`))
  } else {
    console.log(
      chalk.redBright(
        `The MD5 of the downloaded is incorrect. Expected ${expectedMD5}, Actual ${md5}`
      )
    )
    shell.rm(downloadedFileName)
    shell.exit(1)
  }

  console.log(chalk.blueBright(`MD5 of downloaded package: ${md5}`))

  // check contents of tar file
  shell.exec(`tar -tf ${downloadedFileName}`) // ToDO .. check contents of the tar file

  shell.rm(downloadedFileName)

  if (command.code !== 0) {
    shell.echo('Error: checking new release failed')
    shell.exit(1)
  }
}
