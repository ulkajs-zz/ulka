const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const log = require("./ulka-log")
const { existsSync } = require("fs")
const { allFiles, mkdir } = require("./ulka-fs")

/** @typedef {{ buildPath: String; pagesPath: String; templatesPath: String; contents: any[]; plugins: any[] }} Configs */

/**
 * Get absolute path
 *
 * @param {String} pathInString path in string separated by / from cwd
 * @param {String} [cwd] Current working directory (default: process.cwd())
 * @return {String} absolute path
 */
function absolutePath(pathInString, cwd = process.cwd()) {
  if (typeof pathInString !== "string") {
    throw new Error("Path provided should be string")
  }
  return path.join(cwd, ...pathInString.split("/"))
}

/**
 * Get configs from ulka-config.js
 *
 * @param {String} cwd
 * @return {Configs} configs
 */
function getConfigs(cwd) {
  const defaultConfigs = {
    buildPath: "build",
    pagesPath: "pages",
    templatesPath: "templates",
    contents: [],
    plugins: []
  }

  let reqConfigs = {}

  const configExists = fs.existsSync(path.join(cwd, "ulka-config.js"))

  if (configExists) {
    reqConfigs = require(path.join(cwd, "ulka-config.js"))
  } else {
    console.log("")
    log.error("ERROR: Config file not found.", true)
    log.warning(
      "Please make sure you have ulka-config.js file in your root directory.",
      true
    )

    process.exit(0)
  }

  const configs = {
    ...defaultConfigs,
    ...reqConfigs
  }

  const buildPath = absolutePath(configs.buildPath, cwd)
  const pagesPath = absolutePath(`src/${configs.pagesPath}`, cwd)
  const templatesPath = absolutePath(`src/${configs.templatesPath}`, cwd)

  const plugins = getPlugins(configs.plugins, cwd)
  const contents = configs.contents.map(content => ({
    ...content,
    path: absolutePath(`src/${content.path}`, cwd),
    template: path.join(templatesPath, content.template)
  }))

  return {
    ...configs,
    plugins,
    buildPath,
    pagesPath,
    templatesPath,
    contents
  }
}

/**
 * Generates hex hash from a string
 *
 * @param {String} str
 * @return {String} Hex hash from given string
 */
function generateHash(str = "") {
  return crypto.scryptSync(str.toString(), str.toString(), 15).toString("hex")
}

/**
 * Change the extension of filePath
 *
 * @param {String} filePath File Path
 * @param {String} newExtention New extension
 * @return {String} FilePath with new extension
 */
function changeExtension(filePath, newExtention) {
  const parsedPath = path.parse(filePath)
  return path.join(parsedPath.dir, parsedPath.name, newExtention)
}

/**
 * Spinner function
 * @param {String} text
 *@return {Function} Stop Spinner
 */
function spinner(text = "") {
  const words = ["| ", "/ ", "- ", "\\ "]
  let i = 0

  const interval = setInterval(() => {
    process.stdout.write(`\r${words[i++]} ${text}`)
    i %= words.length
  }, 100)

  return () => clearInterval(interval)
}

const getPlugins = (pluginArr, cwd) => {
  const plugins = {
    beforeBuild: [],
    afterBuild: [],
    remarkablePlugin: [],
    beforeContentRender: [],
    afterContentRender: [],
    beforePageRender: [],
    afterPageRender: []
  }

  for (const plugin of pluginArr) {
    let pPath = ""
    let options = {}

    if (existsSync(cwd, plugin)) {
      plugin = path.join(cwd, plugin)
    }

    if (typeof plugin === "string") {
      pPath = require.resolve(plugin)
    } else if (typeof plugin === "object" && plugin.resolve) {
      pPath = require.resolve(plugin.resolve)
      options = plugin.options || {}
    } else {
      log.error("Invalid plugin: ", true)
      console.log(plugin)
      process.exit(0)
    }

    const pluginObj = require(pPath)

    for (const key in pluginObj) {
      if (pluginObj.hasOwnProperty(key)) {
        const somePlugin = pluginObj[key]
        if (plugins[somePlugin.name]) {
          const pluginFunc = (...args) => somePlugin(...args, options)
          plugins[somePlugin.name].push(pluginFunc)
        }
      }
    }
  }

  return plugins
}

const changeCssUrlPath = (css, dir, info) => {
  return css.replace(/ url\((.*?)\)/gs, (...args) => {
    const pathGiven = args[1].replace(/'|"/gs, "")

    if (
      pathGiven.startsWith("http:") ||
      pathGiven.startsWith("https:") ||
      pathGiven.startsWith("//")
    )
      return ` url("${pathGiven}")`

    const realPath = path.join(dir, pathGiven)

    const salt = path.relative(info.cwd, realPath).split(path.sep).join("")

    const fileName = generateHash(salt)

    return ` url("${fileName + path.parse(pathGiven).ext}")`
  })
}

/**
 * @param {Object} info info
 */
function copyAssets(info) {
  const allFilesinCwd = allFiles(path.join(info.cwd, "src"))

  const ignoreExt = [".md", ".ulka"]

  mkdir(path.join(info.configs.buildPath, "__assets__"))

  for (const file of allFilesinCwd) {
    const parsed = path.parse(file)

    if (!parsed.name.endsWith("ulka") && !ignoreExt.includes(parsed.ext)) {
      try {
        const salt = path.relative(info.cwd, file).split(path.sep).join("")

        const newName = generateHash(salt) + parsed.ext

        const writepath = path.join(
          info.configs.buildPath,
          "__assets__",
          newName
        )

        let readData = ""
        if (parsed.ext === ".css") {
          readData = fs.readFileSync(file, "utf-8")
          readData = changeCssUrlPath(readData, parsed.dir, info)
        } else {
          readData = fs.readFileSync(file)
        }

        fs.writeFileSync(writepath, readData)
      } catch (e) {
        log.error(`Error while copying assets: ${file}\n`, true)

        console.log(e)
      }
    }
  }
}

module.exports = {
  absolutePath,
  getConfigs,
  generateHash,
  changeExtension,
  spinner,
  copyAssets
}
