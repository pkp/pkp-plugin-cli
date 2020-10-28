/**
 * @file src/utils/checkSumFile.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 *
 * @brief Helper function to calculate the md5 check sum of a file
 *
 * This calculates checksum of a file (defaulting to MD5) and provides an easier
 * promise-based interface to creating a hash with crypto package
 */
const crypto = require('crypto')
const fs = require('fs')

module.exports = function checksumFile (path, hashName = 'md5') {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(hashName)
    const stream = fs.createReadStream(path)
    stream.on('error', err => reject(err))
    stream.on('data', chunk => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}
