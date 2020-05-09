const execa = require('execa')
const inquirer = require('inquirer')

const git = require('../utils/git')
const createGithubRelease = require('./createGithubRelease')
const createTag = require('./createTag')
const uploadRelease = require('./uploadRelease')

module.exports = async (newVersion, pluginName) => {
  const repoUrl = await git.getRemoteUrl()

  const tag = await createTag(pluginName, newVersion, repoUrl)

  await createGithubRelease(repoUrl, tag)

  await uploadRelease(tag)
}
