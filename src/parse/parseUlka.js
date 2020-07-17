const fs = require('fs')
const path = require('path')
const { parse } = require('ulka-parser')
const generateFileName = require('../utils/generateName')
const globalInfo = require('../index')
const absolutePath = require('../utils/absolutePath')

const $assets = filePath => {
  const fileName = generateFileName(
    path.join(
      process.cwd(),
      path.parse(filePath).dir +
        path.parse(filePath).name +
        path.parse(filePath).ext
    )
  )
  return path.join(path.sep, '__assets__', fileName) + path.parse(filePath).ext
}

const $importUlka = (filePath, values) => {
  const ulkaFile = absolutePath(filePath)
  return parseUlka(fs.readFileSync(ulkaFile, 'utf-8'), { $assets, ...values })
    .html
}

const parseUlka = (ulkaTemplate, values) => {
  values = {
    ...values,
    $assets,
    globalInfo,
    $importUlka: filePath => $importUlka(filePath, values)
  }
  return {
    html: parse(ulkaTemplate, values)
  }
}

module.exports = parseUlka
