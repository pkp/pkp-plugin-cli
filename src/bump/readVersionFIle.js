const { readFile } = require('../utils/files')

const readVersionFile = async fileName => {
  try {
    const file = await readFile('./version.xml')
    return file
  } catch (err) {
    if (err.code === 'ENOENT') {
      error(
        'Could not find version.xml. Make sure to run the command in the root of your plugin.'
      )
      return
    }
    throw err
  }
}

module.exports = readVersionFile
