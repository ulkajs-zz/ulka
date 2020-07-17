const crypto = require('crypto')

const generateFileName = filePath =>
  crypto.scryptSync(filePath, 'files', 15).toString('hex')

module.exports = generateFileName
