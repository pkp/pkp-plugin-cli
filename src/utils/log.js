/**
 * @file src/utils/log.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @module log
 *
 * @brief Wrapper around logging functions
 *
 * Provides a wrapper around console.log, info, error to consolidate the use of colors
 * for different log actions (coloring using chalk library)
 */
const chalk = require('chalk')

const debug = (...args) => {
  if (process.env.DEBUG) { console.log(chalk.dim(args)) }
}

const info = (...args) => {
  console.log(chalk.dim(args))
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
  success,
  debug
}
