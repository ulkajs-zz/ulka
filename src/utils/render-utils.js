const fs = require("fs")
const path = require("path")
const fm = require("front-matter")
const { render } = require("ulka-parser")
const { Remarkable } = require("remarkable")

const md = new Remarkable()

/**
 * Render markdown as html
 *
 * @param {String} filePath - Full path to the markdown file.
 * @param {Object} values - Variables to be available inside markdown
 * @return {{html: String, frontMatter: Object}}
 */
function renderMarkdown(filePath, values) {
  const markdown = fs.readFileSync(filePath, "utf-8")
  const contents = fm(markdown)

  const html = md.render(contents.body)

  const htmlFromUlka = renderUlka(html, values)

  return {
    html: htmlFromUlka,
    frontMatter: contents.attributes
  }
}

/**
 * Render ulka as html
 *
 * @param {String} filePath Full path to the ulka files
 * @param {Object} values - Variables to be available inside ulka
 * @return {String}
 */
function renderUlka(filePath, values) {
  const template = fs.readFileSync(filePath, "utf-8")

  const context = ulkaContext(values)

  const html = render(template, context)

  return html
}

/**
 * Create context for ulka-parser from given values and default values
 *
 * @param {Object} values
 * @param {String} filePath
 * @return {Object} Context
 */
function ulkaContext(values, filePath) {
  values = {
    ...values,
    $import: rPath => $import(rPath, values, filePath)
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
 * @return {any}
 */
function $import(rPath, values, filePath) {
  const imgExts = [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".svg", ".webp"]

  const file = path.join(path.parse(filePath).dir, rPath)

  const ext = path.parse(file).ext

  if (ext === ".ulka") {
    return renderUlka(file, values)
  } else if (ext === ".md") {
    return renderMarkdown(file, values).html
  } else if (imgExts.includes(ext)) {
    const imgContent = fs.readFileSync(file, "base64")
    return `data:image/${ext.substr(1)};base64,` + imgContent
  } else {
    return fs.readFileSync(file, "utf-8")
  }
}

module.exports = {
  renderMarkdown,
  renderUlka
}
