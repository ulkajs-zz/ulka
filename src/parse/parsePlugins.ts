import globalInfo from '../globalInfo'

function getPlugins(funcName: string) {
  return globalInfo.configs.plugins
    .map((plugin: any) => {
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
      (pluginObj: { plugin: any }) =>
        pluginObj &&
        Object.prototype.hasOwnProperty.call(pluginObj.plugin, funcName)
    )
    .map((pluginObject: any) => (...args: any) =>
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

export {
  beforeUlkaParse,
  afterUlkaParse,
  beforeMdParse,
  remarkPlugins,
  afterMdParse,
  beforeBuild,
  afterBuild
}
