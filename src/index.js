const globalInfo = require('./globalInfo')
const parseUlka = require('./parse/parseUlka')
const parseMd = require('./parse/parseMd')
const copyAssets = require('./fs/copyAssets')

module.exports = {
  globalInfo,
  parseUlka,
  parseMd,
  copyAssets
}
