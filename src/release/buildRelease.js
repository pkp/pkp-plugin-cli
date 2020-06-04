/**
 * @file src/release/buildRelease.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Helper for building a release (used by pkp-plugin release command)
 *
 * This helper performs these actions:
 * - prompts the user to run any extra build commands in the current folder (gulp build, composer install etc..)
 * - creates a Tar file from the current folder (in preparation to uploading it as an asset to the Github release)
 */
const { error, log, info } = require('../utils/log')
const inquirer = require('inquirer')
const execa = require('execa')
const tar = require('tar')

const choices = ['No build step', 'composer install', 'gulp build']

module.exports = async ({ pluginName: fileName }) => {
  const { buildCommand } = await inquirer.prompt([
    {
      type: 'list',
      name: 'buildCommand',
      message:
        'What build command do you want to run before pushing  the release?',
      choices
    }
  ])

  if (buildCommand !== choices[0]) {
    try {
      info(`Running the command: ${buildCommand}`)
      const [command, ...restArgs] = buildCommand.split(' ')
      console.log(command, restArgs)
      const { stderrr } = await execa(command, restArgs)
      error(stderrr)
    } catch (err) {
      error(err)
      // ToDo: make running build more sophisticated
      log('ignoring the build error')
    }
  }

  log(`Creating tar file..`)

  const { stdout: tempFileName } = await execa('mktemp', `${fileName}XXXXXXXX`)

  const result = await tar.c(
    {
      gzip: true,
      file: tempFileName
    },
    ['./']
  )

  log(`Tar file created.`)

  return tempFileName
}
