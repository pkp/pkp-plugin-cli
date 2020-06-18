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
const { error, log, info, debug } = require('../utils/log')
const inquirer = require('inquirer')
const execa = require('execa')
const tar = require('tar')
const fs = require("fs");

const choices = ['No build step', 'composer install', 'gulp build']

module.exports = async ({ pluginName: fileName }) => {
  try {
    info('Building the release')
    debug('Running submodule update command')
    const { stderr: submoduleUpdateError } = await execa('git', ['submodule', 'update', '--init', '--recursive'])
    debug(submoduleUpdateError)
    debug('Finished submodule update')

    if (fs.existsSync('./composer.json')) {
      info('Composer file detected. The tool will run "composer install".')
      const { stderr } = await execa('composer', ['install'])
      error(stderr)
    } else {
      info('No composer.json file found')
    }

    if (fs.existsSync('./gulpfile.js')) {
      info('Gulp file detected. The tool will run "gulp build".')
      const { stderr } = await execa('gulp', ['build'])
      error(stderr)
    } else {
      debug('No gulp file file found')
    }

  } catch (err) {
    error(err)
    // ToDo: make running build more sophisticated
    log('An error happened while trying to run the build commands. It will be ignored, you can run any necessary build commands manually then rerun this tool.')
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
