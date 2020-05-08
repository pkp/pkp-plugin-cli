const inquirer = require('inquirer')
const execa = require('execa')
const { log } = require('../utils/log')
const git = require('../utils/git')

const createTag = async (pluginName, newVersion, repoUrl) => {
  const { tag } = await inquirer.prompt([
    {
      type: 'input',
      name: 'tag',
      message: `What tag to apply to this commit?`,
      default: getPossibleTag(pluginName, newVersion)
    }
  ])

  await execa('git', ['tag', tag])
  const { pushTag } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'pushTag',
      message: `The tag ${tag} will be pushed to ${repoUrl}. Is that ok?`,
      default: true
    }
  ])

  await git.pushTag()

  log(`Tag ${tag} pushed to remote.`)

  return tag
}

const getPossibleTag = (pluginName, newVersion) => {
  const possibleTag = `${pluginName}-${newVersion.replace(/\./g, '_')}`.replace(
    /_(\d+)$/,
    '-$1'
  )
  return possibleTag
}

module.exports = createTag
