const globalInfo = require('../globalInfo')

const plugins = globalInfo.configs.plugins

function getPlugins(funcName) {
  return plugins
    .filter(plugin => Object.prototype.hasOwnProperty.call(plugin, funcName))
    .map(plugin => plugin[funcName])
}

const beforeUlkaParse = getPlugins('beforeUlkaParse')
const afterUlkaParse = getPlugins('afterUlkaParse')

const beforeMdParse = getPlugins('beforeMdParse')
const afterMdParse = getPlugins('afterMdParse')

const beforeBuild = getPlugins('beforeBuild')
const afterBuild = getPlugins('afterBuild')

const frontMatterParse = getPlugins('frontMatterParse')

module.exports = {
  frontMatterParse,
  beforeUlkaParse,
  afterUlkaParse,
  beforeMdParse,
  afterMdParse,
  beforeBuild,
  afterBuild
}
