const path = require("path")

/**
 * Returns absolute path
 * @param {String} pathInString path in string separated by / from cwd
 * @return {String} absolute path
 */
function absolutePath(pathInString) {
  if (typeof args !== "string") {
    throw new Error("Path provided should be string")
  }
  return path.join(process.cwd(), ...pathInString.split("/"))
}

module.exports = {
  absolutePath
}
