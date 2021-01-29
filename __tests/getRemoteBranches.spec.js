const getRemoteBranches = require('../src/generate-site/getRemoteBranches')
const remoteBranchesMock = require('./mocks/remoteBranchesMock')

test.skip('getRemoteBranches', async () => {
  const result = await getRemoteBranches(input)
  expect(result).toEqual(remoteBranchesMock)
})

const input = [
  {
    url: 'https://github.com/asmecher/hypothesis'
  },
  {
    url: 'https://github.com/pkp/shibboleth'
  },
  {
    url: 'https://github.com/pkp/translator'
  },
  {
    url: 'https://github.com/asmecher/backup'
  },
  {
    url: 'https://github.com/asmecher/plagiarism'
  },
  {
    url: 'https://github.com/pkp/coins'
  },
  {
    url: 'https://github.com/pkp/quickSubmit'
  },
  {
    url: 'https://github.com/ajnyga/allowedUploads'
  },
  {
    url: 'https://github.com/pkp/piwik'
  },
  {
    url: 'https://github.com/ojsde/shariff'
  },
  {
    url: 'https://github.com/pkp/addThis'
  },
  {
    url: 'https://github.com/a-vodka/ojs_copernicus_export_plugin/'
  },
  {
    url: 'https://github.com/asmecher/subscriptionSSO'
  },
  {
    url: 'https://github.com/ajnyga/funding/'
  },
  {
    url: 'https://github.com/asmecher/customHeader/'
  },
  {
    url: 'https://github.com/pkp/customLocale/'
  },
  {
    url: 'https://github.com/pkp/jatsTemplate/'
  },
  {
    url: 'https://github.com/asmecher/sword/'
  },
  {
    url: 'https://github.com/pkp/oaiJats/'
  },
  {
    url: 'https://github.com/lepidus/ojs3-keywordcloud-plugin'
  },
  {
    url: 'https://github.com/NateWr/bootstrap3'
  },
  {
    url: 'https://github.com/pkp/classic'
  },
  {
    url: 'https://github.com/pkp/healthSciences'
  },
  {
    url: 'https://github.com/NateWr/defaultManuscript'
  },
  {
    url: 'https://github.com/asmecher/texture'
  },
  {
    url: 'https://github.com/pkp/crossrefReferenceLinking'
  },
  {
    url: 'https://github.com/pkp/immersion'
  },
  {
    url: 'https://github.com/pkp/orcidProfile'
  },
  {
    url: 'https://github.com/pkp/defaultTranslation'
  },
  {
    url: 'https://github.com/pkp/paperbuzz'
  },
  {
    url: 'https://github.com/ojsde/openAIRE'
  },
  {
    url: 'https://github.com/withanage/lensGalleyBits'
  },
  {
    url: 'https://github.com/4Science/reviewercredits-ojs'
  },
  {
    url: 'https://github.com/ulsdevteam/ojs-plum-plugin'
  },
  {
    url: 'https://github.com/ulsdevteam/ojs-sushiLite-plugin'
  },
  {
    url: 'https://github.com/ulsdevteam/pkp-betterPassword'
  },
  {
    url: 'https://github.com/ulsdevteam/pkp-akismet'
  },
  {
    url: 'https://github.com/ulsdevteam/pkp-formHoneypot'
  },
  {
    url: 'https://github.com/ewhanson/authorRequirements'
  },
  {
    url: 'https://github.com/pkp/registrationNotification'
  },
  {
    url: 'https://github.com/pkp/controlPublicFiles'
  },
  {
    url: 'https://github.com/pkp/textEditorExtras'
  },
  {
    url: 'https://github.com/RBoelter/ojs3-twitter-sidebar'
  },
  {
    url: 'https://github.com/RBoelter/announcementsBlock'
  },
  {
    url: 'https://github.com/quoideneuf/swordServer'
  },
  {
    url: 'https://github.com/pkp/returningAuthorScreening'
  },
  {
    url: 'https://github.com/ajnyga/openGraph'
  },
  {
    url: 'https://github.com/publons/ojs_3_plugin/'
  },
  {
    url: 'https://github.com/pkp/pragma'
  },
  {
    url: 'https://github.com/escire/ArchivematicaExportPlugin'
  },
  {
    url: 'https://github.com/pkp/pln'
  }
]