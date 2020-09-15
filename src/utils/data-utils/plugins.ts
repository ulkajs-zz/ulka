import { configs } from "./"

function getPluginFunction(plugin: any) {
  if (typeof plugin === "object" && typeof plugin.resolve === "string") {
    return {
      plugin: require(plugin.resolve),
      options: plugin.options
    }
  } else if (typeof plugin === "string") {
    return { plugin: require(plugin) }
  } else if (typeof plugin === "function") {
    return { plugin: plugin() }
  }
}

function pluginByFunctionName(obj: any, funcName: string) {
  return obj && Object.prototype.hasOwnProperty.call(obj.plugin, funcName)
}

function argsAndOptionsToPlugins(pluginObj: any, funcName: string) {
  return (...args: any) =>
    pluginObj.plugin[funcName](...args, pluginObj.options)
}

// Returns all plugins which exports the function named funcName
function getPlugins(funcName: string) {
  return configs.plugins
    .map((plugin: any) => getPluginFunction(plugin))
    .filter((pluginObj: any) => pluginByFunctionName(pluginObj, funcName))
    .map((pluginObj: any) => argsAndOptionsToPlugins(pluginObj, funcName))
}

const beforeUlkaParse = getPlugins("beforeUlkaParse")
const afterUlkaParse = getPlugins("afterUlkaParse")

const beforeMdParse = getPlugins("beforeMdParse")
const afterMdParse = getPlugins("afterMdParse")

const beforeBuild = getPlugins("beforeBuild")
const afterBuild = getPlugins("afterBuild")

const remarkPlugins = getPlugins("remarkPlugin")
const rehypePlugins = getPlugins("rehypePlugin")

export {
  beforeUlkaParse,
  afterUlkaParse,
  beforeMdParse,
  rehypePlugins,
  remarkPlugins,
  afterMdParse,
  beforeBuild,
  afterBuild
}
