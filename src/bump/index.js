/**
 * @file src/bump/index.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Entry point for bump command
 *
 * This command (pkp-plugin bump) runs on a plugins root folder (containing version.xml).
 * It provides an interactive CLI to collect the new version and release date of the plugin,
 * then updates the XML file.
 */
const xml2js = require('xml2js')
const inquirer = require('inquirer')
const chalk = require('chalk')
const process = require('process')
const { warn, error, info } = require('../utils/log')
const { writeFile } = require('../utils/files')
const getNextVersion = require('../utils/getNextVersion')
const publishRelease = require('../release/publishRelease')
const readVersionFile = require('./readVersionFIle')

module.exports = async args => {
  const file = await readVersionFile()
  if (!file) return process.exit(1)

  const { parseStringPromise } = xml2js
  const parsedXml = await parseStringPromise(file)
  const { version } = parsedXml
  const {
    application: [pluginName],
    release: [release],
    date: [date]
  } = version

  const suggestedDate = new Date().toISOString().replace(/T.+$/, '')

  info(
    `\nPublish a new release of ${chalk.bold.magenta(pluginName)} ${chalk.dim(
      `(current: ${release}, date: ${date})`
    )}\n`
  )

  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'release',
        message: `What is the version of the release you want to publish?`,
        default: getNextVersion(release),
        validate: value => {
          if (!value) return 'Version number should be provided'
          if (!value.match(/^(\d+\.)?(\d+\.)?(\d+\.)?(\*|\d+)$/))
            return 'Version format incorrect'
          if (value === release)
            return 'New Version should be different from current version'
          else return true
        }
      },
      {
        type: 'input',
        name: 'date',
        message: `What is the release date?`,
        default: suggestedDate,
        validate: value => {
          if (!value) return 'Release date should be provided'
          if (!value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))
            return 'Version format incorrect'
          return true
        }
      }
    ])

    let result = file.replace(
      new RegExp(`<release>${release}</release`),
      `<release>${answers.release}</release`
    )

    result = result.replace(
      new RegExp(`<date>${date}</date>`),
      `<date>${answers.date}</date>`
    )

    await writeFile(`./version.xml`, result)
    info(`Updated contents of version.xml`)

    publishRelease(answers.release, pluginName)
  } catch (err) {
    if (err.isTtyError) {
      error(`Prompt couldn't be rendered in the current environment`)
    } else {
      error(err)
    }
  }
}
