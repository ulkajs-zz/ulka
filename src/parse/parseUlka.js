const path = require('path')
const { parse } = require('ulka-parser')
const generateFileName = require('../utils/generateName')
const globalInfo = require('../index')

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

const parseUlka = (ulkaTemplate, values) => {
  values = {
    ...values,
    $assets,
    globalInfo
  }

  return {
    html: parse(ulkaTemplate, values)
  }
}

module.exports = parseUlka
