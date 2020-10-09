const fs = require("fs")
const path = require("path")
const fm = require("front-matter")
const { render } = require("ulka-parser")
const { Remarkable } = require("remarkable")
const { getConfigs } = require("./helpers")
const {
  generateContentMap,
  generatePagesMap
} = require("../generate/files-map")

const md = new Remarkable()

/**
 * Render markdown as html
 *
 * @param {String} filePath - Full path to the markdown file.
 * @param {Object} values - Variables to be available inside markdown
 * @param {Boolean} [isData]
 * @return {{html: String, frontMatter: Object, fields: Object}}
 */
function renderMarkdown(filePath, values, isData = false) {
  let markdown

  if (isData) {
    markdown = filePath
  } else {
    markdown = fs.readFileSync(filePath, "utf-8")
  }

  const data = {
    markdown,
    fields: {}
  }

  const { body, attributes } = fm(data.markdown)

  data.body = body
  data.frontMatter = attributes

  data.html = md.render(data.body)

  data.htmlFromUlka = renderUlka(data.html, {
    frontMatter: data.frontMatter,
    markdown: data.markdown,
    fields: data.fields,
    raw: data.html,
    ...values
  })

  return {
    html: data.htmlFromUlka,
    frontMatter: data.markdown,
    fields: data.fields
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

  const context = ulkaContext(values, filePath)

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
    $import: (requirePath, $values = {}) => {
      return $import(requirePath, { ...values, ...$values }, filePath)
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

/**
 * Global Info
 *
 * @param {String} cwd
 * @return {any} globalInfo
 */
function ulkaInfo(cwd) {
  const configs = getConfigs(cwd)

  const allContentsDataMap = {}
  const allContentsMap = {}

  for (const content of configs.contents) {
    const contentMap = generateContentMap(content, { configs })

    allContentsMap[content.name] = contentMap
    allContentsDataMap[content.name] = Object.values(contentMap)
  }

  const pagesMap = generatePagesMap(configs.pagesPath, {
    configs,
    contents: allContentsDataMap
  })

  return {
    configs,

    contents: allContentsDataMap,
    contentsObject: allContentsMap,

    pages: Object.values(pagesMap),
    pagesObject: pagesMap,

    task: "still"
  }
}

module.exports = {
  renderMarkdown,
  renderUlka,
  ulkaInfo
}
