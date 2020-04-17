const fs = require('fs')

const readFile = (fileName, encoding = 'utf8') => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, encoding, (err, data) => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      return resolve(data)
    })
  })
}

const writeFile = (fileName, content, encoding = 'utf8') => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, content, encoding, err => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      return resolve()
    })
  })
}

module.exports = { readFile, writeFile }
