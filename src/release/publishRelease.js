/**
 * @file src/release/index.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Helper for building a release (used by pkp-plugin release command)
 *
 * This helper is the actual entry point for the operations performed by the command.
 * It was abstracted in a separate module to separate from parsing command lines argument
 * in cases where the command is executed when prompted after running pkp-plugin bump
 * (as opposed to when it's run with pkp-plugin release newversion 2.0.0) 
 */
const execa = require('execa')
const buildRelease = require('./buildRelease')
const git = require('../utils/git')
const createGithubRelease = require('./createGithubRelease')
const createTag = require('./createTag')
const uploadRelease = require('./uploadRelease')

module.exports = async (newVersion, pluginName) => {
  const repoUrl = await git.getRemoteUrl()
  const branch = await git.getBranchName()

  const tag = await createTag({ pluginName, newVersion, repoUrl, branch })

  const tarFile = await buildRelease({ pluginName, repoUrl, branch })
  await createGithubRelease({ repoUrl, tag })
  await uploadRelease({ tag, pluginName, tarFile })
}
