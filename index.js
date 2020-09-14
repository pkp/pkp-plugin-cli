/**
 * @file index.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Entry point to the command line tool
 *
 * It parses the arguments passed to the command line tool and decides which module to invoke
 */
const minimist = require('minimist')
const shell = require('shelljs')

const help = require('./src/help')
const version = require('./src/version')
const validateAllReleases = require('./src/validate-all-releases')
const validateNewRelease = require('./src/validate-new-release')
const bump = require('./src/bump')
const release = require('./src/release')

const { error } = require('./src/utils/log')
const generateSite = require('./src/generate-site')

const start = async args => {
  try {
    const params = minimist(args)
    let cmd = params._[0] || 'help'

    if (params.version || params.v) {
      cmd = 'version'
    }

    if (params.help || params.h) {
      cmd = 'help'
    }

    switch (cmd) {
      case 'release':
        return release(params)
      case 'bump':
        return bump(params)
      case 'validate-new-release':
        return validateNewRelease(params)
      case 'validate-all-releases':
        return validateAllReleases(params)
      case 'generate-site':
        return generateSite(params)
      case 'version':
        return version(params)
      case 'help':
        return help(params)
      default:
        error(`"${cmd}" is not a valid command!`)
        break
    }
  } catch (err) {
    error(err)
    shell.exit(1)
  }
}

start(process.argv.slice(2))
