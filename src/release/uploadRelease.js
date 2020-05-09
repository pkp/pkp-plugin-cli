const inquirer = require('inquirer')
const { Octokit } = require('@octokit/rest')
const chalk = require('chalk')
const mime = require('mime-types')
const { createReadStream, statSync } = require('fs')
const { basename } = require('path')
const process = require('process')

const { log, error, success, warn } = require('../utils/log')

module.exports = async tag => {
  const owner = 'kabaros'
  const repo = 'hypothesis'
  const filename = 'version.xml'
  const name = basename(filename)

  let octokit
  let url

  const { token } = await inquirer.prompt([
    {
      type: 'password',
      name: 'token',
      message: 'What is your Github personal token?',
      validate: async token => {
        try {
          octokit = new Octokit({
            auth: `token ${token}`
          })

          url = await getReleaseUrl(octokit, { owner, repo, tag })
          return true
        } catch (err) {
          if (err.status === 401) {
            warn(
              `The token you enetered is wrong. Make sure you have setup a personal token following the procedure here: ${chalk.underline(
                'https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line'
              )}`
            )
          }
          if (err.status === 404) {
            warn(
              `We could not find the release ${tag}. Make sure you have published it on Github before proceeding.`
            )
          }
          error(err)
          return false
        }
      }
    }
  ])

  const { size } = statSync(filename)

  try {
    const result = await octokit.repos.uploadReleaseAsset({
      url,
      data: createReadStream(filename),
      headers: {
        'content-type': mime.lookup(filename),
        'content-length': size
      },
      name,
      owner,
      repo
    })

    const { status } = result

    if (status === 201)
      success(`file "${filename}" uploaded successfully to release ${url}`)
    else error(JSON.stringify(result))
  } catch (err) {
    if (err.status === 422) {
      error(`The file you tried to upload to the release already exists.`)
    }
    error(err)
    process.exit(1)
  }
}

async function getReleaseUrl (octokit, { owner, repo, tag }) {
  const release = await octokit.repos.getReleaseByTag({ owner, repo, tag })

  return release.data.upload_url
}
