const globalInfo = require('./globalInfo')
const rmDir = require('./fs/rmdir')
const mkdir = require('./fs/mkdir')
const allFiles = require('./fs/allFiles')
const dataFromPath = require('./utils/dataFromPath')
const generateName = require('./utils/generateName')
const parseUlkaWithPlugins = require('./utils/ulka-parser-util')
const parseMarkdownWithPlugins = require('./utils/md-parser-util')
const absolutePath = require('./utils/absolutePath')

module.exports = {
  globalInfo,
  fs: {
    rmDir,
    mkdir,
    allFiles
  },
  utils: {
    dataFromPath,
    generateName,
    absolutePath
  },
  parseWithPlugins: {
    parseUlkaWithPlugins,
    parseMarkdownWithPlugins
  }
}
