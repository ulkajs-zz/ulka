const globalInfo = require('../globalInfo')

const plugins = globalInfo.configs.plugins

function getPlugins(funcName) {
  return plugins
    .filter(plugin => Object.prototype.hasOwnProperty.call(plugin, funcName))
    .map(plugin => plugin[funcName])
}

const beforeUlkaParse = getPlugins('beforeUlkaParse')
const afterUlkaParse = getPlugins('afterUlkaParse')

const beforeBuild = getPlugins('beforeBuild')
const afterBuild = getPlugins('afterBuild')

module.exports = {
  beforeUlkaParse,
  afterUlkaParse,
  beforeBuild,
  afterBuild
}
