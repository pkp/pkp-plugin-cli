/**
 * @file src/utils/plugins/extractAllPlugins.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 *
 * @brief Helper function to extract all plugins from a Plugin Gallery xml
 *
 *
 * @param {string} filePath the path to the file to parse and extract the releases info from
 *
 */
const xml2js = require('xml2js')

const { readFile } = require('../utils/files')
const { debug, error } = require('../utils/log')

const parser = new xml2js.Parser()

const extractData = async (filePath, releaseVersions) => {
  debug(`Extracting releases from ${filePath}`)

  const xml = await readFile(filePath)

  const result = await parser.parseStringPromise(xml)

  debug(`${result.plugins.plugin.length} plugins found`)

  const plugins = result.plugins.plugin.map(plugin => {
    if (!plugin.name) {
      error(`${JSON.stringify(plugin)}\n`)
      throw new Error('The last plugin does not have have a name attribute')
    }

    const releases = plugin.release.map(release => {
      const version = release.$.version
      const date = release.$.date

      // console.log(release)

      const compatibility = release.compatibility.map(compat => {
        return compat.version
      })
      var allCompatibilities = [].concat.apply([], compatibility).join(', ')

      return {
        version,
        date,
        url: release.package[0],
        compatibility: allCompatibilities
      }
    })

    releases.sort(function (a, b) { return new Date(b.date) - new Date(a.date) })

    const branchesWithPackages = releaseVersions.map(version => {
      const matchingRelease = releases.find(r => {
        return r.compatibility.match(version)
      })
      console.log(matchingRelease)
      return matchingRelease
    })

    return {
      // name: plugin.name[0]._,
      name: plugin.homepage[0].replace('https://github.com/', '').replace(/\/$/, '').replace('/', ' / '),
      url: plugin.homepage[0],
      branchesWithPackages,
      releases: releases
    }
  })

  // console.log(plugins)

  return plugins
}

module.exports = extractData
