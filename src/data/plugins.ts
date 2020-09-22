import { Processor } from "unified/types/ts3.4/index"
import configs from "./configs"

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

export type PluginBeforeUlka = (context: {
  ulkaTemplate: string
  values: object
}) => void

export type PluginAfterUlka = (context: {
  html: string
  values: object
}) => void

export type PluginBeforeMd = (context: {
  markdown: string
  frontMatter: object
  fields: object
}) => void

export type PluginAfterMd = (context: {
  html: string
  frontMatter: object
  fields: object
}) => void

export type UlkaPluginRemark = (
  processor: Processor
) => {
  plugin: any
  options: object
}

export type UlkaPluginRehype = (
  processor: Processor
) => {
  plugin: any
  options: object
}

export type BeforeAfterBuild = (globalInfo: object) => void

const beforeUlkaParse: PluginBeforeUlka[] = getPlugins("beforeUlkaParse")
const afterUlkaParse: PluginAfterUlka[] = getPlugins("afterUlkaParse")

const beforeMdParse: PluginBeforeMd[] = getPlugins("beforeMdParse")
const afterMdParse: PluginAfterMd[] = getPlugins("afterMdParse")

const beforeBuild: BeforeAfterBuild[] = getPlugins("beforeBuild")
const afterBuild: BeforeAfterBuild[] = getPlugins("afterBuild")

const remarkPlugins: UlkaPluginRemark[] = getPlugins("remarkPlugin")
const rehypePlugins: UlkaPluginRehype[] = getPlugins("rehypePlugin")

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
