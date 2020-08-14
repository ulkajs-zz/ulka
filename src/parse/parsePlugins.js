const globalInfo = require('../globalInfo')

function getPlugins(funcName) {
  return globalInfo.configs.plugins
    .map(plugin => {
      if (typeof plugin === 'object' && typeof plugin.resolve === 'string') {
        console.log(plugin)
        return {
          plugin: require(plugin.resolve),
          options: plugin.options
        }
      } else if (typeof plugin === 'string') {
        return { plugin: require(plugin) }
      } else if (typeof plugin === 'function') {
        return { plugin }
      }
    })
    .filter(
      plugin =>
        plugin && Object.prototype.hasOwnProperty.call(plugin.plugin, funcName)
    )
    .map(plugin => (...args) => plugin[funcName](...args, plugin.options))
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
