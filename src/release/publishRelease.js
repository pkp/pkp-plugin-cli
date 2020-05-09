const execa = require('execa')
const buildRelease = require('./buildRelease')
const git = require('../utils/git')
const createGithubRelease = require('./createGithubRelease')
const createTag = require('./createTag')
const uploadRelease = require('./uploadRelease')

module.exports = async (newVersion, pluginName) => {
  const repoUrl = await git.getRemoteUrl()

  const tag = await createTag({ pluginName, newVersion, repoUrl })

  const tarFile = await buildRelease({ pluginName })
  await createGithubRelease({ repoUrl, tag })
  await uploadRelease({ tag, pluginName, tarFile })
}
