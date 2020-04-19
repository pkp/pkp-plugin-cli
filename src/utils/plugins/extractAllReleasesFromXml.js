const xml2js = require('xml2js')

const { readFile } = require('../files')
const { info } = require('../log')

const parser = new xml2js.Parser()

/**
 * The function loops through the plugins and their releases and creates a text file containing a list
 * of the releases and their MD5 sums This is then consument by the bash script "checkMD5sum" that
 * downloads all the releases and compares their MD5 sums with the content of the generated file
 *
 * @param {string} filePath the path to the file to parse and extract the releases info from
 */
const extractData = async filePath => {
  info(`Extracting releases from ${filePath}`)

  const xml = await readFile(filePath)
  const releases = []

  const result = await parser.parseStringPromise(xml)

  result.plugins.plugin.forEach(plugin => {
    plugin.release.forEach(release => {
      if (release.package.length > 1) {
        throw 'Each release should have one package'
      }
      const expectedMd5Sum = release.$.md5
      const version = release.$.version

      releases.push({
        expectedMd5Sum,
        version,
        url: release.package[0],
        plugin: {
          displayName: plugin.name[0]._,
          name: plugin.$.product
        }
      })
    })
  })

  info(
    `Extracted data successfuly. ${result.plugins.plugin.length} plugins / ${releases.length} releases`
  )
  return releases
}

module.exports = extractData
