const fs = require('fs')
const path = require('path')
const mkdir = require('./mkdir')
const configs = require('../parse/parseConfig')
const allFiles = require('./allFiles')
const absolutePath = require('../utils/absolutePath')
const generateFileName = require('../utils/generateName')
const parseUlka = require('../parse/parseUlka')
const globalInfo = require('..')

const parseUrlPath = css => {
  return css.replace(/ url\((.*?)\)/gs, (...args) => {
    const pathGiven = args[1].replace(/'|"/gs, '')
    const fileName = generateFileName(
      path.join(
        process.cwd(),
        path.parse(pathGiven).dir +
          path.parse(pathGiven).name +
          path.parse(pathGiven).ext
      )
    )

    return ` url("${fileName + path.parse(pathGiven).ext}")`
  })
}

const copyAssets = async (
  dir = path.join(process.cwd(), 'src'),
  to = 'build'
) => {
  await mkdir(`${to}/__assets__`)
  const files = allFiles(dir)
    .map(f => path.parse(f))
    .filter(f => f.ext !== '.ulka' && f.ext !== '.md')
    .forEach(async f => {
      const assetExt = f.ext === '.ucss' ? '.css' : f.ext
      const writePath =
        absolutePath(
          configs.buildPath +
            '/__assets__/' +
            generateFileName(f.dir + f.name + f.ext)
        ) + assetExt

      let readAssetsFile
      if (assetExt === '.css') {
        readAssetsFile = (
          await parseUlka(
            fs.readFileSync(path.format(f), 'utf-8'),
            globalInfo,
            writePath
          )
        ).html
        readAssetsFile = parseUrlPath(readAssetsFile, 'utf-8')
      } else {
        readAssetsFile = fs.readFileSync(path.format(f))
      }

      fs.writeFileSync(writePath, readAssetsFile)
    })
  return files
}

module.exports = copyAssets
