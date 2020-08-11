const fs = require('fs')
const path = require('path')
const { parse } = require('ulka-parser')
const generateFileName = require('../utils/generateName')
const globalInfo = require('../index')
const { beforeUlkaParse, afterUlkaParse } = require('./parsePlugins')

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
    html: await parseWithPlugins(ulkaTemplate, values, {
      base: path.parse(filePath).dir,
      logError: false
    })
  }
}

const parseWithPlugins = async (ulkaTemplate, values, options) => {
  for (let i = 0; i < beforeUlkaParse.length; i++) {
    const plugin = beforeUlkaParse[i]

    const data = await plugin(ulkaTemplate, values) // => { ulkaTemplate, values }

    ulkaTemplate = data.ulkaTemplate
    values = { ...values, ...data.values }
  }

  ulkaTemplate = await parse(ulkaTemplate, values, options)

  for (let i = 0; i < afterUlkaParse.length; i++) {
    const plugin = afterUlkaParse[i]
    ulkaTemplate = await plugin(ulkaTemplate, values, options) // => string (html)
  }

  return ulkaTemplate
}

module.exports = parseUlka
