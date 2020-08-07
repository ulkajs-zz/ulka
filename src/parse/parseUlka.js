const fs = require('fs')
const path = require('path')
const { parse } = require('ulka-parser')
const generateFileName = require('../utils/generateName')
const globalInfo = require('../index')

const $assets = (rPath, filePath) => {
  const fileName = generateFileName(path.join(path.parse(filePath).dir, rPath))

  const ext = path.parse(rPath).ext === '.ucss' ? '.css' : path.parse(rPath).ext

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

const parseUlka = async (ulkaTemplate, values = {}, filePath) => {
  values = {
    ...values,
    $assets: rPath => $assets(rPath, filePath),
    globalInfo,
    $importUlka: rPath => $importUlka(rPath, values, filePath)
  }
  return {
    html: await parse(ulkaTemplate, values, {base: filePath})
  }
}

module.exports = parseUlka
