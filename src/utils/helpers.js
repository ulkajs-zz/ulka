const path = require("path")

/**
 * Returns absolute path
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

module.exports = {
  absolutePath
}
