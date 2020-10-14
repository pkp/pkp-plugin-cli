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
const { error, log, warn, info, debug } = require('../utils/log')
const inquirer = require('inquirer')
const execa = require('execa')
const tar = require('tar')
const fs = require("fs");
const shell = require('shelljs');
const checkSumFile = require('../utils/checkSumFile');

const choices = ['No build step', 'composer install', 'gulp build']

module.exports = async ({ pluginName: fileName, repoUrl }) => {
  info('Building the release')
  debug('Clone the repo to start with a fresh copy')
  const { stdout: cloneTempDir } = await execa('mktemp', ['-d'])
  let { stdout: cloneResult } = await execa('git', ['clone', repoUrl, cloneTempDir])
  debug('Cloned to temp dir:', cloneTempDir)

  const originalDir = process.cwd()
  debug(`current directory: ${process.cwd()}`)
  shell.cd(cloneTempDir)
  debug(`current directory: ${process.cwd()}`)

  debug('Running submodule update command')
  const { stderr: submoduleUpdateError } = await execa('git', ['submodule', 'update', '--init', '--recursive'])
  debug(submoduleUpdateError)
  debug('Finished submodule update')

  try {
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

    if (fs.existsSync("./package.json")) {
      info('Package.json file detected. The tool will run "npm install".')
      const { stderr } = await execa("npm", ["install"])
      error(stderr)
    } else {
      debug("No package.json file file found")
    }
  } catch (err) {
    error(err)
    // ToDo: make running build more sophisticated
    log('An error happened while trying to run the build commands (gulp or composer). It will be ignored, you can run any necessary build commands manually then rerun this tool.')
  }

  deleteExtraFiles(fileName)

  log(`Creating tar file..`)
  const { stdout: tarTempFileName } = await execa('mktemp', `${fileName}XXXXXXXX`)
  shell.cd(cloneTempDir)

  const result = await tar.c(
    {
      gzip: true,
      file: tarTempFileName,
      prefix: fileName,
    },
    ['./']
  )

  debug(`Created tar file: ${tarTempFileName}`)

  const md5sum = await checkSumFile(tarTempFileName)
  warn(`MD5 Sum of the tar file: ${md5sum}`)
  log(`Tar file created.`)

  shell.cd(originalDir)

  return tarTempFileName
}

const deleteExtraFiles = (fileName) => {
  shell.rm('-rf', '.git')
  debug('Deleting files defined in exclusions.txt')
  const exclusionsFile = shell.head('./exclusions.txt').toString()
  const folderPrefix = new RegExp('^' + fileName + '/')
  exclusionsFile.split('\n').forEach(file => {
    if (!file) return
    const fileToDelete = file.replace(folderPrefix, '')
    shell.rm('-rf', fileToDelete)
  })
}