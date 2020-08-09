const path = require('path')
const globalInfo = require('../src')
const copyAssets = require('../src/fs/copyAssets')
const removeDirectories = require('../src/fs/rmdir')
const generateFromMd = require('../src/generate/generateMd')
const generateFromUlka = require('../src/generate/generateUlka')

async function build() {
  globalInfo.contentFiles = []
  try {
    console.log('>> Copying assets'.green)
    await copyAssets(
      path.join(process.cwd(), 'src'),
      globalInfo.configs.buildPath
    )
    console.log('>> Generating from markdown files'.green)
    await generateFromMd()
    console.log('>> Generating from ulka files'.green)
    await generateFromUlka()
  } catch (e) {
    console.log(`>> ${e.message}\n`.red, e)
    console.log('>> Build Failed'.red)
    console.log(`>> Removing ${globalInfo.configs.buildPath}`)
    await removeDirectories(globalInfo.configs.buildPath)
    process.exit(0)
  }
}

module.exports = build
