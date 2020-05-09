const { error, log } = require('../utils/log')
const inquirer = require('inquirer')
const execa = require('execa')
const tar = require('tar')

const choices = [
  'No build step',
  'composer install (not implemented yet)',
  'gulp build (not implemented yet)'
]

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
  log(`Creating tar file..`)

  const { stdout: tempFileName } = await execa('mktemp', `${fileName}XXXXXXXX`)

  const result = await tar.c(
    {
      gzip: true,
      file: tempFileName
    },
    ['./']
  )

  log(`Tar file created. ${tempFileName}`)

  return tempFileName
}
