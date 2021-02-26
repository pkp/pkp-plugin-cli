/**
 * @file src/release/createTag.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Helper for building a release (used by pkp-plugin release command)
 *
 * This helper performs these actions:
 * - commit the change
 * - tags the commit (the user can update the default tag suggested)
 * - push the tag to Github
 */
const inquirer = require('inquirer')
const execa = require('execa')
const process = require('process')
const { info, error } = require('../utils/log')
const git = require('../utils/git')

const createTag = async ({ pluginName, newVersion, repoUrl, branch = 'main' }) => {
  info(
    'We will commit the change, tag the commit and push it to Github. Then we will create a release draft, and upload an asset to the release.'
  )
  const { tag } = await inquirer.prompt([
    {
      type: 'input',
      name: 'tag',
      message: 'What tag do you want to apply to this commit?',
      default: getPossibleTag(pluginName, newVersion)
    }
  ])

  try {
    info('Committing version.xml... ')
    await git.commitVersionFile(newVersion)
    info('Creating an annotated tag... ')
    await execa('git', ['tag', '-a', '-m', tag, tag])

    info('Pushing tag to remote - this may take a second or two... ')
    await execa('git', ['push', '--set-upstream', 'origin', branch, '--follow-tags'])

    // await git.pushTag()
    info(`Tag ${tag} pushed to remote.`)

    return tag
  } catch (err) {
    const { stderr } = err
    if (stderr.match(/pathspec 'version.xml' did not match any files/)) {
      error('No version.xml found. Exiting the process.')
      return process.exit(1)
    }
    error(err)
    process.exit(1)
  }
}

const getPossibleTag = (pluginName, newVersion) => {
  const possibleTag = `v${newVersion.replace(/\./g, '_')}`.replace(
    /_(\d+)$/,
    '-$1'
  )
  return possibleTag
}

module.exports = createTag
