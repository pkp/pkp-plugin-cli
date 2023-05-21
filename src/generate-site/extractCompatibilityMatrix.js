/**
 * @file src/utils/plugins/extractAllPlugins.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 *
 * @brief Helper function to extract all plugins from a Plugin Gallery xml, and generate a matrix of compatibility
 * The columns in the matrix maps to each column in the final table (the releases scraped by finding all branches with stable in them)
 * and the rows are foreach plugin, and their compatibility with that realease.
 * The compatibility is checked by checking the plugins.xml compatibility, and also checking if there are any branches in the plugin repo with the same name as the release branch name
 *
 * @param {string} filePath the path to the file to parse and extract the releases info from
 *
 */
const xml2js = require('xml2js')

const { readFile } = require('../utils/files')
const { debug, error } = require('../utils/log')
const map = require('lodash/map')
const flatten = require('lodash/flatten')
var request = require('sync-request')

const getRemoteBranches = require('./getRemoteBranches')

const parser = new xml2js.Parser()

const extractData = async (filePath, releaseVersions) => {
  debug(`Extracting releases from ${filePath}`)

  const xml = await readFile(filePath)

  const result = await parser.parseStringPromise(xml)

  debug(`${result.plugins.plugin.length} plugins found`)

  debug('Retrieving remote branches for all plugins.')
  const remoteBranches = await getRemoteBranches(result.plugins.plugin.map(p => ({ url: p.homepage[0] })))

  // loop through all plugins in plugins.xml (i.e from plugins gallery xml)
  const plugins = result.plugins.plugin.map(plugin => {
    if (!plugin.name) {
      error(`${JSON.stringify(plugin)}\n`)
      throw new Error('The last plugin does not have have a name attribute')
    }

    const homepage = plugin.homepage[0]

    // get all release for that plugin with their compatible version
    const releases = plugin.release.map(release => {
      return {
        version: release.$.version,
        date: release.$.date,
        url: release.package[0],
        // get all the compatible versions for this release from the "compatibility/version" nodes in the XML
        // join them in a string to make it easier to match in the next step for cases when we have .0 at the end (like match 2.1.0 with 2.1.0.0)
        compatibility: flatten(map(release.compatibility, 'version')).join(', ')
      }
    })

    // sort them by date to deal with when version number is missing last part (like 1.0.2.0 and 1.0.2) so that we match the newest matching version
    releases.sort(function (a, b) { return new Date(b.date) - new Date(a.date) })

    const compatibilityMatrix = releaseVersions.map(({ version, branchName }, index) => {
      const matchingRelease = releases.find(r => {
        return r.compatibility.match(version)
      })
      if (!matchingRelease) {
        for (let i = index; i < releaseVersions.length; i++) {
          const anyMatch = releases.find(r => {
            return r.compatibility.match(releaseVersions[i].version)
          })
          if (anyMatch) {
            return {
              columnName: version,
              lastCompatible: `${anyMatch.version} for ${releaseVersions[i].version}`
            }
          }
        }
        return { columnName: version, noData: true }
      }
      const hasBranch = branchName && remoteBranches[homepage][branchName] && `${homepage}/tree/${branchName}`

      const compatibilityValues =
          {
            columnName: version,
            pluginVersion: matchingRelease.version,
            date: matchingRelease.date,
            url: matchingRelease.url,
            hasBranch
          }
      if (hasBranch) {
        const pluginRepo = homepage.replace('https://github.com/', '')
        try {
          const result = request('get', 'https://api.travis-ci.com/repos/' + `${pluginRepo}/branches/${branchName}`, {
            headers: {
              Accept: 'application/vnd.travis-ci.2.1+json',
              Host: 'api.travis-ci.com'
            }
          }
          )
          const json = JSON.parse(result.getBody().toString())
          if (json && json.branch && json.branch.state !== '') {
            compatibilityValues.travisLink = `https://app.travis-ci.com/github/${pluginRepo}/builds/` + json.branch.id
            if (json.branch.state === 'passed') {
              compatibilityValues.travisStatusPassed = true
            }
            if (json.branch.state === 'errored') {
              compatibilityValues.travisStatusErrored = true
            }
          }
        } catch (e) {
          debug(e.toString())
        }
      }
      if (!compatibilityValues.travisStatusErrored && !compatibilityValues.travisStatusPassed) {
        compatibilityValues.travisStatusUndefined = true
      }
      return compatibilityValues
    })

    return {
      name: prettifyPluginName(homepage),
      url: homepage,
      compatibilityMatrix
    }
  })

  return plugins
}

const prettifyPluginName = (githubUrl) => {
  return githubUrl.replace('https://github.com/', '').replace(/\/$/, '').replace('/', ' / ')
}

module.exports = extractData
