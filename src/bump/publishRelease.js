const execa = require('execa')
const inquirer = require('inquirer')

const createGithubRelease = require('./createGithubRelease')
const createTag = require('./createTag')
const git = require('../utils/git')

module.exports = async (newVersion, pluginName) => {
  const repoUrl = await git.getRemoteUrl()

  const { createCommit } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'createCommit',
      message: 'Do you want to commit the changes?',
      default: true
    }
  ])

  if (!createCommit) return

  await git.commitVersionFile(newVersion)

  const tag = await createTag(pluginName, newVersion, repoUrl)

  await createGithubRelease(repoUrl, tag)
}
