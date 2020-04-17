const https = require('follow-redirects').https
const fs = require('fs')

/**
 * Downloads a file from the internet following the redirect (which is needed for Github links)
 */
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
