/**
 * @file src/generate-site/ojs.js
 *
 * Copyright (c) 2021 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief helper function to get the stable branches of OJS
 *
 * These will correspond to the columns in the final generated HTML report
 */

const { Octokit } = require('@octokit/rest')
let octokit

const listBranches = async () => {
  const token = process.env.GITHUB_TOKEN
  octokit = new Octokit({
    auth: `token ${token}`
  })

  let result = await octokit.repos.listBranches({
    owner: 'pkp',
    repo: 'ojs'
  })

  result = result.data.filter(branch => branch.name.match(/stable/))

  return result
}

module.exports = { listBranches }
