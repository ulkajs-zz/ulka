const globalInfo = require('../globalInfo')

function getPlugins(funcName) {
  return globalInfo.configs.plugins
    .map(plugin => {
      if (typeof plugin === 'object' && typeof plugin.resolve === 'string') {
        return {
          plugin: require(plugin.resolve),
          options: plugin.options
        }
      } else if (typeof plugin === 'string') {
        return { plugin: require(plugin) }
      } else if (typeof plugin === 'function') {
        return { plugin: plugin() }
      }
    })
    .filter(
      pluginObj =>
        pluginObj &&
        Object.prototype.hasOwnProperty.call(pluginObj.plugin, funcName)
    )
    .map(pluginObject => (...args) =>
      pluginObject.plugin[funcName](...args, pluginObject.options)
    )
}

const beforeUlkaParse = getPlugins('beforeUlkaParse')
const afterUlkaParse = getPlugins('afterUlkaParse')

const beforeMdParse = getPlugins('beforeMdParse')
const afterMdParse = getPlugins('afterMdParse')

const beforeBuild = getPlugins('beforeBuild')
const afterBuild = getPlugins('afterBuild')

const remarkPlugins = getPlugins('remarkablePlugin')

module.exports = {
  beforeUlkaParse,
  afterUlkaParse,
  beforeMdParse,
  remarkPlugins,
  afterMdParse,
  beforeBuild,
  afterBuild
}
