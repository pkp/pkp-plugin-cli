const { Octokit } = require('@octokit/rest')
let octokit

// const ojsRepo = 'https://github.com/pkp/ojs.git'

const listBranches = async () => {
  const token = process.env.GITHUB_TOKEN || '6d76bcf570aff15db57354d17a3c93ff8c41fce2'
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
