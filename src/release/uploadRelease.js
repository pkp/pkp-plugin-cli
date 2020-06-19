/**
 * @file src/release/uploadRelease.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Helper for uploading a release to Github (used by pkp-plugin release command)
 *
 * This helper performs these actions:
 * - prompts the user for Github token (or uses the one from env variable)
 * - uses Github API to upload the release tar file (built by buildRelease in previous step) to Github
 */
const inquirer = require('inquirer')
const { Octokit } = require('@octokit/rest')
const chalk = require('chalk')
const { createReadStream, statSync } = require('fs')
const { basename } = require('path')
const process = require('process')
const hostedGitInfo = require('hosted-git-info')
const { log, error, info, success, warn, debug } = require('../utils/log')
const { getRemoteUrl } = require('../utils/git')

let octokit

module.exports = async ({ tag, pluginName, tarFile }) => {
  const remoteUrl = await getRemoteUrl()
  debug(`remote url for current folder: ${remoteUrl}`)

  const { user: owner, project: repo } = hostedGitInfo.fromUrl(remoteUrl)
  debug(`current repo info. Owner: ${owner}, Repo: ${repo}`)

  let url

  const { GITHUB_TOKEN: tokenFromEnvironment } = process.env

  if (tokenFromEnvironment) {
    info('We will use the Github Token provided in the environment variable.')

    try {
      url = await getReleaseUrl(tokenFromEnvironment, { owner, repo, tag })
    } catch (err) {
      error(err)
      url = await promptForGithubToken({ owner, repo, tag })
    }
  }
  else {
    url = await promptForGithubToken({ owner, repo, tag })
  }

  const { size } = statSync(tarFile)

  try {
    info('uploading release..')
    const result = await octokit.repos.uploadReleaseAsset({
      url,
      data: createReadStream(tarFile),
      headers: {
        'content-type': 'application/gzip',
        'content-length': size
      },
      name: `${repo}-${tag}.tar.gz`,
      owner,
      repo
    })

    const { status } = result

    if (status === 201) {
      success(`"${pluginName}" uploaded successfully to release.`)
    } else error(JSON.stringify(result))
  } catch (err) {
    if (err.status === 422) {
      error(`The file you tried to upload to the release already exists.`)
    }
    error(err)
    process.exit(1)
  }
}

async function promptForGithubToken({ owner, repo, tag }) {
  let url

  const message = process.env.GITHUB_TOKEN ? 'Enter your Github personal token (or Enter to use the one already provided)'
    : 'Enter your Github personal token'

  const { token } = await inquirer.prompt([
    {
      type: 'password',
      name: 'token',
      message,
      default: process.env.GITHUB_TOKEN,
      validate: async (token) => {
        if (!token) return false
        try {
          url = await getReleaseUrl(token, { owner, repo, tag })
          return true
        } catch (err) {
          error(err)
          return false
        }
      }
    }
  ])
  return url
}

async function getReleaseUrl(token, { owner, repo, tag }) {
  try {
    octokit = new Octokit({
      auth: `token ${token}`
    })

    const release = await octokit.repos.getReleaseByTag({ owner, repo, tag })

    return release.data.upload_url
  } catch (err) {
    const UNAUTHORIZED = 401
    const NOT_FOUND = 404

    debug(err)
    debug(err.status)

    if (err.status === UNAUTHORIZED) {
      warn(
        `The token you enetered is wrong. Make sure you have setup a personal token following the procedure here: ${chalk.underline(
          'https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line'
        )}`
      )
    }
    if (err.status === NOT_FOUND) {
      warn(
        `We could not find the release ${tag}. Make sure you have published it on Github before proceeding.`
      )
    }

    throw (err)
  }
}
