/**
 * @file src/generate-site/getRemoteBranches.js
 *
 * Copyright (c) 2021 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief helper function to retrieve all the remote branches for each plugin
 *
 * This is then used when generating the compatibility matrix to see if there is a remote branch
 * for the plugin that matches the current stable branch on OJS
 */

const execa = require('execa')
const async = require('async')
const { debug, error, info } = require('../utils/log')

const getRemoteBranches = async (plugins) => {
  const PROCESS_LIMIT = 5 // it seems that having more than x requests in parallel causes it to hang
  const remoteBranches = {}
  await async.forEachOfLimit(plugins, PROCESS_LIMIT, async (plugin) => {
    const gitUrl = plugin.url
    debug(`\tProcessing "${gitUrl}"`)
    try {
      const branches = {}
      const { stdout } = await execa('git', ['ls-remote', '--heads', gitUrl])
      stdout.split(/\n/).forEach(b => {
        const [commit, branch] = b.split(/\t/)
        branches[branch.replace('refs/heads/', '')] = { commit }
        // return { commit, branch }
      })
      remoteBranches[gitUrl] = branches
      return { [gitUrl]: branches }
    } catch (err) {
      error('Error ', err)
      return []
    }
  })
  info('finished retrieving branches.')
  return remoteBranches
}

module.exports = getRemoteBranches
