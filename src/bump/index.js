const xml2js = require('xml2js')
const inquirer = require('inquirer')
const chalk = require('chalk')

const { parseStringPromise } = xml2js
const { warn, error } = require('../utils/log')
const { readFile, writeFile } = require('../utils/files')

module.exports = async args => {
  const file = await readVersionFile()
  const parsedXml = await parseStringPromise(file)
  const { version } = parsedXml
  const {
    application: [pluginName],
    release: [release],
    date: [date]
  } = version

  const suggestedDate = new Date().toISOString().replace(/T.+$/, '')

  console.log(
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
      new RegExp(`<date>${date}</date`),
      `<date>${answers.date}</date>`
    )

    const { saveFile } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'saveFile',
        message: `Would you like to save the file and replace plugins.xml?`,
        default: false
      }
    ])

    if (saveFile) {
      await writeFile(`./version.xml`, result)
      console.log(`Updated contents of version.xml`)
    } else {
      console.log(`${chalk.dim(result)}`)
      console.log(
        `Above is the content of the updated file. You can Copy/Paste it manually to plugins.xml.`
      )
    }
  } catch (err) {
    if (err.isTtyError) {
      error(`Prompt couldn't be rendered in the current environment`)
    } else {
      error(err)
    }
  }
}

const readVersionFile = async fileName => {
  try {
    const file = await readFile('./version.xml')
    return file
  } catch (err) {
    if (err.code === 'ENOENT') {
      error(
        'Could not find version.xml. Make sure to run the command in the root of your plugin.'
      )
    }
    throw err
  }
}
