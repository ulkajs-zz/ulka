const generateFromMd = require('../src/generate/generateMd')
const generateFromUlka = require('../src/generate/generateUlka')
const copyAssets = require('../src/fs/copyAssets')
const globalInfo = require('../src')

async function build() {
  globalInfo.contentFiles = []
  await generateFromMd()
  await generateFromUlka()
  await copyAssets()
}

module.exports = build
