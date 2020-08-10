const crypto = require('crypto')

const generateFileName = filePath => {
  if (typeof filePath !== 'string')
    throw new Error('FilePath provided should be string')
  return crypto.scryptSync(filePath, 'files', 15).toString('hex')
}

module.exports = generateFileName
