const inquirer = require('inquirer')
const execa = require('execa')
const open = require('open')
const newGithubReleaseUrl = require('new-github-release-url')

module.exports = async (repoUrl, tag) => {
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

  await open(url)
}
