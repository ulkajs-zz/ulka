const fs = require("fs")
const path = require("path")

/**
 * Create context for ulka-parser from given values and default values
 *
 * @param {Object} values
 * @param {String} filePath
 * @param {String} cwd
 * @return {Object} Context
 */
function ulkaContext(values, filePath, cwd) {
  values = {
    ...values,
    $import: (requirePath, $values = {}) => {
      return $import(requirePath, { ...values, ...$values }, filePath, cwd)
    }
  }

  return values
}

/**
 * $import function
 * - return ulka and md as html
 * - return images as base64 url
 * - return the utf-8 content for other files
 *
 * @param {String} rPath Require path
 * @param {Object} values Variables to be available inside ulka
 * @param {any} filePath Path to file
 * @param {String} cwd
 * @return {any}
 */
function $import(rPath, values, filePath, cwd) {
  const imgExts = [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".svg", ".webp"]
  const file = path.join(path.parse(filePath).dir, rPath)
  const ext = path.parse(file).ext
  if (ext === ".ulka") {
    const raw = fs.readFileSync(file, "utf-8")
    const Ulka = require("../generate/Ulka")
    const uInstance = new Ulka(raw, file, values, cwd)
    return uInstance.render()
  } else if (ext === ".md") {
    const raw = fs.readFileSync(file, "utf-8")
    const Markdown = require("../generate/Markdown")
    const mInstance = new Markdown(raw, file, values, {}, cwd)
    return mInstance.render(true)
  } else if (imgExts.includes(ext)) {
    const imgContent = fs.readFileSync(file, "base64")
    return `data:image/${ext.substr(1)};base64,` + imgContent
  } else {
    return fs.readFileSync(file, "utf-8")
  }
}

module.exports = {
  $import,
  ulkaContext
}
