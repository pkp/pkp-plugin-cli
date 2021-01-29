const { generateHtml } = require('../src/generate-site')

jest.mock('../src/generate-site/getRemoteBranches', () => {
  return () => {
    const remoteBranchesMock = require('./mocks/remoteBranchesMock')
    return remoteBranchesMock
  }
})

describe('generateHTML', () => {
  test('generates the final HTML table', async () => {
    // getRemoteBranches
    const rendered = await generateHtml('./__tests/plugins-test.xml')
    expect(rendered).toMatchSnapshot()
  })
})
