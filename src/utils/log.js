const chalk = require('chalk')

const info = (...args) => {
  console.log(chalk.blueBright(args))
}

const log = (...args) => {
  console.log(chalk.whiteBright(args))
}

const warn = (...args) => {
  console.log(chalk.yellowBright(args))
}

const error = (...args) => {
  console.error(chalk.redBright(args))
}

const success = (...args) => {
  console.log(chalk.greenBright(args))
}

module.exports = {
  info,
  log,
  warn,
  error,
  success
}
