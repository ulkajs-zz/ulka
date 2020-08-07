const globalInfo = require('../src')
const copyAssets = require('../src/fs/copyAssets')
const configs = require('../src/parse/parseConfig')
const removeDirectories = require('../src/fs/rmdir')
const generateFromMd = require('../src/generate/generateMd')
const generateFromUlka = require('../src/generate/generateUlka')

async function build() {
  globalInfo.contentFiles = []
  try {
    await copyAssets()
    await generateFromMd()
    await generateFromUlka()
  } catch (e) {
    console.log(e)
    console.log('\n>> Build Failed:\n ')
    await removeDirectories(configs.buildPath)
    process.exit(0)
  }
}

module.exports = build
