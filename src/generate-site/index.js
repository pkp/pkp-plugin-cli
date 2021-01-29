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
const path = require('path')
const extractCompatibilityMatrix = require('./extractCompatibilityMatrix')
const { readFile, writeFile } = require('../utils/files')
const { info, error } = require('../utils/log')
const execa = require('execa')
const Mustache = require('mustache')
const git = require('../utils/git')
const username = require('git-username')
const { listBranches } = require('./ojs')

const generateHtml = async (inputFilePath) => {
  const branches = await listBranches()
  info(`${branches.length} stable branches found`)

  // await validateXml(inputFilePath)
  const releaseVersions = branches.map(b => {
    const matchVersion = b.name.match(/([0-9_])+$/)

    const result = (matchVersion && matchVersion[0]) || ''
    // return result.replace(/_/g, '.')
    return {
      version: result.replace(/_/g, '.'),
      branchName: b.name
    }
  }).reverse()

  const plugins = await extractCompatibilityMatrix(inputFilePath, releaseVersions)

  const template = await readFile(path.join(__dirname, 'template.mustache'))

  let idx = 1
  const rendered = Mustache.render(template, {
    plugins,
    releaseVersions,
    idx: function () {
      return idx++
    }
  })
  return rendered
}

module.exports = async args => {
  try {
    const inputFilePath = getFilePathFromArgs(args)
    info(`Generating site out of ${inputFilePath}`)

    const rendered = await generateHtml(inputFilePath)

    const { stdout: tmpFolder } = await execa('mktemp', ['-d'])
    const destinationFolder = `${tmpFolder}/pkp-plugins`

    // Clone compatibility website repo
    const repo = process.env.PLUGINS_SITE_URL || 'https://github.com/pkp/plugin-compatibility.git'
    await git.clone(repo, destinationFolder)

    // Update the new generated index.html file
    await writeFile(`${destinationFolder}/index.html`, rendered)
    info(`${destinationFolder}/index.html`)

    // commit the new index.html
    await shell.cd(destinationFolder)
    try {
      await execa('git', ['add', 'index.html'])
      await execa('git', ['commit', '-m', 'Update contents of website'])
    } catch (err) {
      const nothingToCommit = !!err.message.match(/nothing to commit/);
      if (nothingToCommit) {
        error(`It seems like the new generated index.html has not changed from the one in the repo, so it will not be published. Check the output in:
          ${destinationFolder}/index.html`)
        return
      }
      throw (err)
    }

    const { GITHUB_TOKEN: githubToken } = process.env
    const gitUrl = await git.getRemoteUrl()
    const gitUrlWithToken = gitUrl.replace(/https:\/\//, `https://${username()}:${githubToken}@`)
    await execa('git', ['remote', 'set-url', 'origin', gitUrlWithToken])
    await execa('git', ['push', 'origin', 'master'])
  } catch (err) {
    error(err)
    shell.exit(1)
  }
}

module.exports.generateHtml = generateHtml

const getFilePathFromArgs = args => {
  let { input } = args
  if (!input) {
    input = args._[1]
  }

  if (!input) {
    throw new Error('No path provided. Run "pkp-plugin help" for information on the command.')
  }

  return input
}
