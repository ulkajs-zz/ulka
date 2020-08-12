const fs = require('fs')
const path = require('path')
const generateFileName = require('../utils/generateName')
const globalInfo = require('../index')
const parseUlkaWithPlugins = require('../utils/ulka-parser-util')

const $assets = (rPath, filePath) => {
  // Generate hash of required file
  const fileName = generateFileName(path.join(path.parse(filePath).dir, rPath))

  // Check extension of required file
  const ext = path.parse(rPath).ext === '.ucss' ? '.css' : path.parse(rPath).ext

  // Return hashed fileName path
  return path.join(path.sep, '__assets__', fileName) + ext
}

const $importUlka = async (rPath, values, filePath) => {
  const ulkaFile = path.join(path.parse(filePath).dir, rPath)
  return (
    await parseUlka(
      fs.readFileSync(ulkaFile, 'utf-8'),
      { $assets, ...values },
      ulkaFile
    )
  ).html
}

const parseUlka = async (
  ulkaTemplate,
  values = {},
  filePath = process.cwd()
) => {
  values = {
    ...values,
    $assets: rPath => $assets(rPath, filePath),
    globalInfo,
    $importUlka: rPath => $importUlka(rPath, values, filePath)
  }

  return {
    html: await parseUlkaWithPlugins(ulkaTemplate, values, {
      base: path.parse(filePath).dir,
      logError: false
    })
  }
}

module.exports = parseUlka
