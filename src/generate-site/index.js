/**
 * @file src/generate-site/index.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Entry point for generate-site command
 *
 * This command (used by CI on Plugin Gallery repository) generates a website containing
 * the state of plugins
 */
const shell = require('shelljs')
// const validateXml = require('../utils/plugins/validateXml')
const extractAllPlugins = require('../utils/plugins/extractAllPlugins')
const { readFile, writeFile } = require('../utils/files')
const { info, error, debug } = require('../utils/log')
const execa = require('execa')
const Mustache = require('mustache');
const { Octokit } = require('@octokit/rest');
const git = require('../utils/git');
const username = require('git-username');

let octokit

module.exports = async args => {
  try {
    const inputFilePath = getFilePathFromArgs(args)
    info(`Generating site out of ${inputFilePath}`)

    const { GITHUB_TOKEN: githubToken } = process.env

    // await validateXml(inputFilePath)
    const plugins = await extractAllPlugins(inputFilePath)
    info(JSON.stringify(plugins, null, 2))

    const template = await readFile(`${__dirname}/template.mustache`)

    let idx = 1
    const rendered = Mustache.render(template, {
      plugins,
      "idx": function () {
        return idx++;
      }
    });

    const { stdout: tmpFolder } = await execa('mktemp', ['-d'])
    const destinationFolder = `${tmpFolder}/pkp-plugins`

    const repo = process.env.PLUGINS_SITE_URL || 'https://github.com/pkp/plugin-compatibility.git'
    await git.clone(repo, destinationFolder)

    await writeFile(`${destinationFolder}/index.html`, rendered)
    info(`${destinationFolder}/index.html`)

    await shell.cd(destinationFolder)
    await execa('git', ['add', 'index.html'])
    await execa('git', ['commit', '-m', 'Update contents of website'])

    const gitUrl = await git.getRemoteUrl()
    const gitUrlWithToken = gitUrl.replace(/https:\/\//, `https://${username()}:${githubToken}@`)
    await execa('git', ['remote', 'set-url', 'origin', gitUrlWithToken])
    await execa('git', ['push', 'origin', 'master'])

  } catch (err) {
    error(err)
    shell.exit(1)
  }
}

const getFilePathFromArgs = args => {
  let { input } = args
  if (!input) {
    input = args._[1]
  }

  if (!input) {
    throw `No path provided. Run "pkp-plugin help" for information on the command.`
  }

  return input
}
