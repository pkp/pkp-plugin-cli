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

const { readFile } = require('../files')
const { info, debug, error } = require('../log')

const parser = new xml2js.Parser()

const extractData = async filePath => {
  debug(`Extracting releases from ${filePath}`)

  const xml = await readFile(filePath)
  const releases = []

  const result = await parser.parseStringPromise(xml)

  debug(`${result.plugins.plugin.length} plugins found`)

  const plugins = result.plugins.plugin.map(plugin => {
    if (!plugin.name) {
      error(`${JSON.stringify(plugin)}\n`)
      throw 'The last plugin does not have have a name attribute'
    }

    const releases = plugin.release.map(release => {
      const expectedMd5Sum = release.$.md5
      const version = release.$.version
      const date = release.$.date



      const compatibility = release.compatibility.map(compat => {
        return compat.$.application + ' ' + compat.version.join(', ')
      })

      return {
        version,
        date,
        url: release.package[0],
        compatibility
      }
    })

    releases.sort(function (a, b) { return new Date(b.date) - new Date(a.date) });

    return {
      // name: plugin.name[0]._,
      name: plugin.homepage[0].replace('https://github.com/', '').replace(/\/$/, ''),
      url: plugin.homepage[0],
      releases: releases
    }
  })

  return plugins
}

module.exports = extractData
