const minimist = require('minimist')

const help = require('./src/help')
const version = require('./src/version')
const validateAllReleases = require('./src/validate-all-releases')
const validateNewRelease = require('./src/validate-new-release')
const bump = require('./src/bump')
const release = require('./src/release')

const start = async args => {
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
    case 'version':
      return version(params)
    case 'help':
      return help(params)
    default:
      console.error(`"${cmd}" is not a valid command!`)
      break
  }
}

start(process.argv.slice(2))
