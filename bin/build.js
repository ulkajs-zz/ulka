const generateFromMd = require('../src/generate/generateMd')
const generateFromUlka = require('../src/generate/generateUlka')
const copyAssets = require('../src/fs/copyAssets')

function build() {
  generateFromMd()
  generateFromUlka()
  copyAssets()
}

module.exports = build
