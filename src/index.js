const globalInfo = require('./globalInfo')
const rmDir = require('./fs/rmdir')
const mkdir = require('./fs/mkdir')
const allFiles = require('./fs/allFiles')
const dataFromPath = require('./utils/dataFromPath')
const generateName = require('./utils/generateName')

module.exports = {
  globalInfo,
  fs: {
    rmDir,
    mkdir,
    allFiles
  },
  utils: {
    dataFromPath,
    generateName
  }
}
