/**
 * @file src/release/createGithubRelease.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Helper for building a release (used by pkp-plugin release command)
 *
 * This helper performs these actions:
 * - Prompts the user to confirm they want to create a release on Github
 * - Opens the URL for Github release prepopulated with the release info
 * - Waits for the user to confirm they have published the release
 *
 * @notes
 * - We can not automatically know when the user has published the release so we require manual confirmation
 *  - using open({wait: true}) could be used but it triggers when the browser is closed (not the tab),
 *  also it does not work on windows
 */
const inquirer = require('inquirer')
const execa = require('execa')
const open = require('open')
const newGithubReleaseUrl = require('new-github-release-url')
const { info } = require('../utils/log')

module.exports = async ({ repoUrl, tag }) => {
  await inquirer.prompt([
    {
      type: 'confirm',
      name: 'createRelease',
      message: 'Would you like to create a release on Github?',
      default: true
    }
  ])

  const { stdout: lastTag } = await execa('git', [
    'describe',
    '--tags',
    '--abbrev=0'
  ])

  const { stdout: body } = await execa('git', [
    'log',
    `${lastTag}..HEAD`,
    '--oneline'
  ])

  const url = newGithubReleaseUrl({
    repoUrl,
    tag,
    body
  })

  info('We will open Github on a browser for you to create the release.')

  await open(url)

  while (true) {
    const created = await checkReleaseCreated()
    if (created) break
  }
}

async function checkReleaseCreated () {
  const { releaseCreated } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'releaseCreated',
      message: 'Once you publish the release on Github, type \'Yes\' to proceed with the following steps.',
      default: true
    }
  ])

  return releaseCreated
}
