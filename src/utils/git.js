/**
 * @file src/utils/git.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Git helpers for some operations needed by the tool
 *
 */
const execa = require('execa')
const githubUrlFromGit = require('github-url-from-git')
const { log } = require('./log')

const getRemoteUrl = async () => {
  const { stdout: remote } = await execa('git', [
    'config',
    '--get',
    'remote.origin.url'
  ])
  return remote.match(/^http/) ? remote : githubUrlFromGit(remote)
}

const getBranchName = async () => {
  const { stdout: branch } = await execa('git', [
    'rev-parse',
    '--abbrev-ref',
    'HEAD'
  ])
  return branch
}

const commitVersionFile = async newVersion => {
  await execa('git', ['add', 'version.xml'])
  await execa('git', ['commit', '-m', `Update to version ${newVersion} `])
}

const pushTag = async () => {
  const { stdout } = await execa('git', ['push', 'origin', '--tags'])
  log(stdout)
}

const clone = async (repo, localFolder) => {
  await execa('git', ['clone', repo, localFolder])
}

module.exports = {
  getRemoteUrl,
  getBranchName,
  commitVersionFile,
  pushTag,
  clone
}
