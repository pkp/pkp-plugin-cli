const extractCompatibilityMatrix = require('../src/generate-site/extractCompatibilityMatrix')

jest.mock('../src/generate-site/getRemoteBranches', () => {
  return () => {
    const remoteBranchesMock = require('./mocks/remoteBranchesMock')
    return remoteBranchesMock
  }
})

describe('extractCompatibilityMatrix', () => {
  const releasepluginVersions = ['3.2.1', '3.2.0',
    '3.1.2', '3.1.1',
    '3.1.0', '3.0.2',
    '3.0.1', '3.0.0',
    '2.4.8', '2.4.7',
    '2.4.6', '2.4.5',
    '2.3'
  ].map(version => ({ version }))
  test('extracts all plugins', async () => {
    const result = await extractCompatibilityMatrix('./__tests/plugins-test.xml', releasepluginVersions)
    expect(result.length).toEqual(51)
    expect(result[0]).toEqual({
      name: 'asmecher / hypothesis',
      url: 'https://github.com/asmecher/hypothesis',
      compatibilityMatrix: [{
        columnName: '3.2.1',
        date: '2020-06-19',
        pluginVersion: '1.0.3.2',
        url: 'https://github.com/asmecher/hypothesis/releases/download/v1.0.3-2/hypothesis-v1.0.3-2.tar.gz'
      },
      {
        columnName: '3.2.0',
        date: '2020-06-19',
        pluginVersion: '1.0.3.2',
        url: 'https://github.com/asmecher/hypothesis/releases/download/v1.0.3-2/hypothesis-v1.0.3-2.tar.gz'
      },
      {
        columnName: '3.1.2',
        date: '2018-04-04',
        pluginVersion: '1.0.1.0',
        url: 'https://github.com/asmecher/hypothesis/releases/download/ojs-3_1_1-0/hypothesis-ojs-3_1_1-0.tar.gz'
      },
      {
        columnName: '3.1.1',
        date: '2018-04-04',
        pluginVersion: '1.0.1.0',
        url: 'https://github.com/asmecher/hypothesis/releases/download/ojs-3_1_1-0/hypothesis-ojs-3_1_1-0.tar.gz'
      },
      {
        columnName: '3.1.0',
        date: '2017-10-23',
        pluginVersion: '1.0.0.0',
        url: 'https://github.com/asmecher/hypothesis/releases/download/ojs-3_1_0-0/hypothesis-ojs-3_1_0-0.tar.gz'
      },
      {
        columnName: '3.0.2',
        date: '2017-02-20',
        pluginVersion: '1.0.0.0',
        url: 'https://github.com/asmecher/hypothesis/releases/download/ojs-3_0_2-0/hypothesis-ojs-3_0_2-0.tar.gz'
      },
        undefined, undefined, undefined, undefined, undefined, undefined,
      {
        columnName: '2.3',
        date: '2018-04-04',
        pluginVersion: '1.0.1.0',
        url: 'https://github.com/asmecher/hypothesis/releases/download/ojs-3_1_1-0/hypothesis-ojs-3_1_1-0.tar.gz'
      }]
    })
    expect(result[50]).toEqual({ compatibilityMatrix: [{ columnName: '3.2.1', date: '2020-07-21', pluginVersion: '2.0.3.1', url: 'https://github.com/pkp/pln/releases/download/v2.0.3-1/pln-v2.0.3-1.tar.gz' }, { columnName: '3.2.0', date: '2020-07-21', pluginVersion: '2.0.2.1', url: 'https://github.com/pkp/pln/releases/download/v2.0.2-1/pln-v2.0.2-1.tar.gz' }, { columnName: '3.1.2', date: '2020-07-21', pluginVersion: '2.0.1.1', url: 'https://github.com/pkp/pln/releases/download/v2.0.1-1/pln-v2.0.1-1.tar.gz' }, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, { columnName: '2.3', date: '2020-07-21', pluginVersion: '2.0.1.1', url: 'https://github.com/pkp/pln/releases/download/v2.0.1-1/pln-v2.0.1-1.tar.gz' }], name: 'pkp / pln', url: 'https://github.com/pkp/pln' })
  })

  test('creates a column for each release', async () => {
    const result = await extractCompatibilityMatrix('./__tests/plugins-test.xml', releasepluginVersions)
    expect(result[0].compatibilityMatrix.length).toEqual(releasepluginVersions.length)
  })

  test('creates a column for each release', async () => {
    const releasesColumns = ['3.2.1', '3.2.0', '2.4.8', '2.3'].map(version => ({ version }))
    const result = await extractCompatibilityMatrix('./__tests/plugins-small.xml', releasesColumns)
    expect(result[0].compatibilityMatrix.length).toEqual(releasesColumns.length)
    expect(result[0]).toEqual({
      name: 'kabaros / hypothesis',
      url: 'https://github.com/kabaros/hypothesis',
      compatibilityMatrix: [
        {
          date: '2020-06-19',
          columnName: '3.2.1',
          url: 'https://github.com/kabaros/hypothesis/releases/download/v1.0.3-2/hypothesis-v1.0.3-2.tar.gz',
          pluginVersion: '1.0.3.2'
        },
        {
          date: '2020-06-19',
          columnName: '3.2.0',
          url: 'https://github.com/kabaros/hypothesis/releases/download/v1.0.3-2/hypothesis-v1.0.3-2.tar.gz',
          pluginVersion: '1.0.3.2'
        },
        undefined,
        {
          date: '2018-04-04',
          columnName: '2.3',
          url: 'https://github.com/kabaros/hypothesis/releases/download/ojs-3_1_1-0/hypothesis-ojs-3_1_1-0.tar.gz',
          pluginVersion: '1.0.1.0'
        }]
    })
  })
})
