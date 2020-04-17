const crypto = require('crypto')
const fs = require('fs')
/**
 * Calculates the md5 check sum of a file
 */
module.exports = function checksumFile (path, hashName = 'md5') {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(hashName)
    const stream = fs.createReadStream(path)
    stream.on('error', err => reject(err))
    stream.on('data', chunk => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}
