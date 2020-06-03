const inquirer = require('inquirer')
const execa = require('execa')
const open = require('open')
const newGithubReleaseUrl = require('new-github-release-url')
const { info } = require('../utils/log')

module.exports = async ({ repoUrl, tag }) => {
  const { createRelease } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'createRelease',
      message: `Would you like to create a release on Github?`,
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
    `--oneline`
  ])

  const url = newGithubReleaseUrl({
    repoUrl,
    tag,
    body
  })

  info(`We will open Github on a browser for you to create the release.`)

  await open(url)

  while (true) {
    const created = await checkReleaseCreated()
    if (created) break;
  }
}

async function checkReleaseCreated() {
  const { releaseCreated } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'releaseCreated',
      message: `Once you publish the release on Github, type 'Yes' to proceed with the following steps.`,
      default: false
    }
  ])

  return releaseCreated
}