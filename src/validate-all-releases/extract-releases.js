const xml2js = require('xml2js')

const { readFile, writeFile } = require('../utils/files')
const { info } = require('../utils/log')

const parser = new xml2js.Parser()

/**
 * The function loops through the plugins and their releases and creates a text file containing a list
 * of the releases and their MD5 sums This is then consument by the bash script "checkMD5sum" that
 * downloads all the releases and compares their MD5 sums with the content of the generated file
 *
 * @param {string} filePath the path to the file to parse and extract the releases info from
 */
const extractData = async args => {
  info(`Extracting releases (${args.input})`)
  const filePath = args.input
  const outFile = `${__dirname}/${Date.now()}.temp`

  const xml = await readFile(filePath)
  try {
    const result = await parser.parseStringPromise(xml)

    let packagesWithSums = ''

    result.plugins.plugin.forEach(plugin => {
      const pluginName = plugin.name[0]._
      plugin.release.forEach(release => {
        if (release.package.length > 1)
          throw 'Each release should have one package'

        const expectedMd5Sum = release.$.md5
        const version = release.$.version

        packagesWithSums += expectedMd5Sum + ':' + release.package[0] + '\n'
      })
    })
    await writeFile(outFile, packagesWithSums)

    info(`Extracted data successfuly. ${outFile}`)
    return outFile
  } catch (err) {
    throw err
  }
}

module.exports = extractData
