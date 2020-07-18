const generateFromMd = require('../src/generate/generateMd')
const generateFromUlka = require('../src/generate/generateUlka')
const copyAssets = require('../src/fs/copyAssets')
const globalInfo = require('../src')

async function build() {
  globalInfo.contentFiles = []
  await copyAssets()
  await generateFromMd()
  await generateFromUlka()
}

module.exports = build
