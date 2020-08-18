import crypto from 'crypto'

const generateFileName = (filePath: string) => {
  if (typeof filePath !== 'string')
    throw new Error('FilePath provided should be string')

  return crypto.scryptSync(filePath, 'files', 15).toString('hex')
}

export default generateFileName
