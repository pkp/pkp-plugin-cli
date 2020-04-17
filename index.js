const minimist = require('minimist')

const help = require('./src/help')
const version = require('./src/version')

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
    case 'version':
      version(params)
      break
    case 'help':
      help(params)
      break
    default:
      console.error(`"${cmd}" is not a valid command!`)
      break
  }
}

start(process.argv.slice(2))
