/**
 * @file src/utils/downloadPackage.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 *
 * @brief Helper function to download a file
 *
 * Downloads a file from the internet taking into consideration follwing a redirect
 * which is needed for Github links
 *
 */
const https = require('follow-redirects').https
const fs = require('fs')

module.exports = (package, fileName) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(fileName)
    const req = https.get(package, function (response) {
      response.pipe(file)
      response.on('end', resolve)
    })
    req.on('error', function (err) {
      console.log('Request error: ' + err.message)
      reject(err)
    })
  })
}
