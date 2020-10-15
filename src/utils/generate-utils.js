const fs = require("fs")
const path = require("path")
const { Remarkable } = require("remarkable")
const { render } = require("ulka-parser")
const { generateHash } = require("./helpers")
const { mkdir } = require("./ulka-fs")
const log = require("./ulka-log")

const md = new Remarkable({ html: true })

/**
 * $import function
 * - return ulka and md as html
 * - return images as base64 url
 * - return the utf-8 content for other files
 *
 * @param {String} rPath Require path
 * @param {Object} values Variables to be available inside ulka
 * @param {any} filePath Path to file
 * @param {String} info
 * @return {any}
 */
function $import(rPath, values, filePath, info) {
  const imgExts = [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".svg", ".webp"]
  const file = path.join(path.parse(filePath).dir, rPath)
  const ext = path.parse(file).ext
  if (ext === ".ulka") {
    const raw = fs.readFileSync(file, "utf-8")
    return renderUlka(raw, values, filePath, info)
  } else if (ext === ".md") {
    const raw = fs.readFileSync(file, "utf-8")
    return renderMarkdown(raw, info)
  } else if (imgExts.includes(ext)) {
    const imgContent = fs.readFileSync(file, "base64")
    return `data:image/${ext.substr(1)};base64,` + imgContent
  } else {
    return fs.readFileSync(file, "utf-8")
  }
}

/**
 * Get assets path
 * @param {String} rPath
 * @param {String} filePath
 * @param {Object} info
 * @return {String} hash
 */
function $assets(rPath, filePath, info) {
  const realPath = path.join(path.parse(filePath).dir, rPath)

  const relPath = path.relative(info.cwd, realPath)

  const salt = relPath.split(path.sep).join("")

  return path.join(`/__assets__/${generateHash(salt)}`) + path.parse(rPath).ext
}

/**
 * markdown to html
 * @param {String} raw Raw markdown
 * @param {Object} info Info
 * @return {String} html
 */
function renderMarkdown(raw, info) {
  info.configs.plugins.remarkablePlugin.forEach(plugin => {
    plugin({ md, info })
  })

  return md.render(raw)
}

/**
 * @param {String} raw Raw ulka
 * @param {Object} context Context
 * @param {String} filePath filepath
 * @param {Object} info
 * @return {String}
 */
function renderUlka(raw, context, filePath, info) {
  context = {
    ...context,
    $assets: rPath => $assets(rPath, filePath, info),
    $import: (rPath, $values = {}) => {
      return $import(rPath, { ...context, ...$values }, filePath, info)
    }
  }
  return render(raw, context, { base: filePath })
}

const contentToHtml = async (contentData, contents, info) => {
  try {
    const beforeContentRenderPlugin = info.configs.plugins.beforeContentRender
    const afterContentRenderPlugin = info.configs.plugins.afterContentRender

    // BeforeContentRender Plugins
    for (const plugin of beforeContentRenderPlugin) {
      await plugin({ contentData, contents, info })
    }

    if (contentData.type === "raw") {
      contentData.html = renderMarkdown(contentData.content, info)
    } else {
      contentData.html = contentData.content
    }

    // AfterContentRender Plugins
    for (const plugin of afterContentRenderPlugin) {
      await plugin({ contentData, contents, info })
    }

    const context = { ...contentData, contents, info, data: contentData.html }
    const filePath = contentData.source || info.cwd

    if (!contentData.template && contentData.templatePath) {
      try {
        contentData.template = fs.readFileSync(contentData.templatePath)
      } catch (e) {
        log.error(e.message, true)
        log.error(`Error while reading ${contentData.templatePath}`)
        process.exit(0)
      }
    }

    const html = renderUlka(
      contentData.template,
      context,
      contentData.templatePath || filePath,
      info
    )

    mkdir(path.parse(contentData.buildPath).dir)

    fs.writeFileSync(contentData.buildPath, html)
  } catch (e) {
    if (contentData.source) {
      log.error(
        `Error while generating html from ${contentData.source}\n`,
        true
      )
    }

    console.log(e)
  }
}

const pageToHtml = async (pageData, pages, contents, info) => {
  try {
    const beforePageRenderPlugins = info.configs.plugins.beforeContentRender
    const afterPageRenderPlugins = info.configs.plugins.afterContentRender

    // BefrePageRender Plugins
    for (const plugin of beforePageRenderPlugins) {
      await plugin({ pageData, pages, contents, info })
    }

    if (pageData.type === "raw") {
      const context = { ...pageData, contents, pages, info }
      const filePath = pageData.source || info.cwd
      pageData.html = renderUlka(pageData.content, context, filePath, info)
    } else {
      pageData.html = pageData.content
    }

    // AfterPageRender Plugins
    for (const plugin of afterPageRenderPlugins) {
      await plugin({ pageData, pages, contents, info })
    }

    mkdir(path.parse(pageData.buildPath).dir)

    fs.writeFileSync(pageData.buildPath, pageData.html)
  } catch (e) {
    if (pageData.source) {
      console.log("")
      log.error(`Error while generating html from ${pageData.source}\n`, true)
    }

    if (e.toString().startsWith("ReferenceError:")) {
      log.error(e.toString() + "\n", true)
    } else {
      console.log(e)
    }
  }
}

module.exports = {
  $import,
  pageToHtml,
  renderUlka,
  renderMarkdown,
  contentToHtml
}
