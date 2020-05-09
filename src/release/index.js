const { warn, info } = require('../utils/log')
const publishRelease = require('./publishRelease')

module.exports = args => {
  const {
    _: [, pluginName],
    newversion,
    newVersion
  } = args

  const version = newversion || newVersion

  info(`Releasing ${pluginName} (version to release: ${version})`)

  publishRelease(version, pluginName)
}
