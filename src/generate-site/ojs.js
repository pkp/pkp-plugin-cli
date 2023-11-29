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

  let pagesRemaining = true
  let page = 1
  const resultsPerPage = 100
  let results = []
  while (pagesRemaining) {
    const pagedResult = await octokit.repos.listBranches({
      owner: 'pkp',
      repo: 'ojs',
      page: page,
      per_page: resultsPerPage
    })

    results = [...results, ...pagedResult.data]
    page++

    if (pagedResult.data.length === 0 || pagedResult.data.length < resultsPerPage) {
      pagesRemaining = false
    }
  }

  results = results.filter(branch => branch.name.match(/stable/))

  return results
}

module.exports = { listBranches }
