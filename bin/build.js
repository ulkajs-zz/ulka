const path = require('path')
const globalInfo = require('../src')
const copyAssets = require('../src/fs/copyAssets')
const removeDirectories = require('../src/fs/rmdir')
const generateFromMd = require('../src/generate/generateMd')
const generateFromUlka = require('../src/generate/generateUlka')

async function build() {
  globalInfo.contentFiles = []
  try {
    await copyAssets(
      path.join(process.cwd(), 'src'),
      globalInfo.configs.buildPath
    )
    await generateFromMd()
    await generateFromUlka()
  } catch (e) {
    console.log(e)
    console.log('\n>> Build Failed:\n ')
    await removeDirectories(globalInfo.configs.buildPath)
    process.exit(0)
  }
}

module.exports = build
