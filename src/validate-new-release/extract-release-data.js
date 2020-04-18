/**
 * scraps a fragment of xml to get the package url, MD5 etc..
 * @param {string} lines the diffed lines showing what changed in a plugins.xml file
 */
const extractReleaseData = lines => {
  const { groups: { package } = {} } =
    /<package>(?<package>[^ $]*)<\/package>/g.exec(lines) || {}

  const { groups: { md5 } = {} } = /md5=\"(?<md5>[^ $]*)\"/g.exec(lines) || {}

  return {
    md5,
    package
  }
}

module.exports = extractReleaseData
