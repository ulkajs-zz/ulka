const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const log = require("./ulka-log")

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
 * @param {String} [cwd]
 * @return {Configs} configs
 */
function getConfigs(cwd = process.cwd()) {
  const defaultConfigs = {
    buildPath: "build",
    pagesPath: "pages",
    templatesPath: "templates",
    contents: [],
    plugins: []
  }

  try {
    let reqConfigs = {}

    const configExists = fs.existsSync(path.join(cwd, "ulka-config.js"))

    if (configExists) {
      reqConfigs = require(path.join(cwd, "ulka-config.js"))
    }

    const configs = {
      ...reqConfigs,
      ...defaultConfigs
    }

    const pagesPath = absolutePath(configs.pagesPath, cwd)
    const templatesPath = absolutePath(configs.templatesPath, cwd)
    const contents = configs.contents.map(content => ({
      ...content,
      path: absolutePath(content.path, cwd)
    }))

    return {
      ...configs,
      pagesPath,
      templatesPath,
      contents
    }
  } catch (e) {
    log.error(`Error while getting configs ${e}`)
  }
}

/**
 * Generates hex hash from a string
 *
 * @param {String} str
 * @return {String}
 */
function generateHash(str) {
  return crypto.scryptSync(str.toString(), str.toString(), 15).toString("hex")
}

module.exports = {
  absolutePath,
  getConfigs,
  generateHash
}
