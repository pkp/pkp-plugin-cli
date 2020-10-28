/**
 * @file src/validate-new-release/extractReleaseDataFromDiff.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @param {string} lines the diffed lines showing what changed in a plugins.xml file
 *
 * @brief Helper function to extract release data from a diff
 *
 * The function parses the output of a diff to find the package information
 * (its url and MD5 namely)
 */
const extractReleaseData = lines => {
  const { groups: { package: releasePackage } = {} } =
    /<package>(?<package>[^ $]*)<\/package>/g.exec(lines) || {}

  const { groups: { md5 } = {} } = /md5="(?<md5>[^ $]*)"/g.exec(lines) || {}

  return {
    md5,
    package: releasePackage
  }
}

module.exports = extractReleaseData
