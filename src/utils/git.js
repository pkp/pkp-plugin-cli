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

const commitVersionFile = async newVersion => {
  await execa('git', ['add', 'version.xml'])
  await execa('git', ['commit', '-m', `Update to version ${newVersion} `])
}

const pushTag = async () => {
  const { stdout } = await execa('git', ['push', 'origin', '--tags'])
  log(stdout)
  return
}

module.exports = {
  getRemoteUrl,
  commitVersionFile,
  pushTag
}
