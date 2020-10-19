const fs = require("fs")
const url = require("url")
const path = require("path")
const fm = require("front-matter")
const { render } = require("ulka-parser")
const { Remarkable } = require("remarkable")

const log = require("./ulka-log")
const { generateHash, getConfigs } = require("./helpers")
const { allFiles, mkdir } = require("./ulka-fs")

const md = new Remarkable({ html: true })

const imageSupportPlugin = md => {
  const original = md.renderer.rules.image
  md.renderer.rules.image = (tokens, idx, ...rest) => {
    const oldSrc = tokens[idx].src

    const newsrc = `{% $assets('${oldSrc}') %}`

    tokens[idx].src = newsrc
    return original(tokens, idx, ...rest)
  }
}

md.use(imageSupportPlugin)

/**
 * @param {Object} info Info
 * @return {Object} contentsMap
 */
function createContentsMap(info) {
  const contents = info.configs.contents // [{ path, generatePath, template, name }]

  const contentsMap = {}

  for (const content of contents) {
    const files = allFiles(content.path, ".md")

    const contentArr = []

    const template = fs.readFileSync(content.template, "utf-8")

    for (const file of files) {
      const raw = fs.readFileSync(file, "utf-8")
      const stat = fs.statSync(file)

      const fileFromContentPath = path.relative(content.path, file)
      const parsedPath = path.parse(fileFromContentPath)

      let buildPath = path.join(
        info.configs.buildPath,
        content.generatePath,
        parsedPath.dir
      )

      buildPath = createBuildPath(parsedPath, buildPath)

      const link = getLink(info.configs, buildPath)

      const { attributes, body } = fm(raw)

      const relativePath = path.relative(info.cwd, file)

      const contentData = {
        name: content.name,
        info: info,
        type: "raw",
        template: template,
        templatePath: content.template,
        values: { frontMatter: attributes, stat, fields: {} },
        content: body,
        source: relativePath,
        buildPath: buildPath,
        link: link
      }

      contentArr.push(contentData)
    }

    contentsMap[content.name] = contentArr
  }
  return contentsMap
}

/**
 * @param {Object} info
 * @param {Object} contents
 * @return {Array} pages
 */
function createPagesArray(info, contents) {
  const files = allFiles(info.configs.pagesPath, ".ulka")

  const pagesArray = []
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8")
    const stat = fs.statSync(file)

    const relativePath = path.relative(info.cwd, file)

    const fileFromPagesPath = path.relative(info.configs.pagesPath, file)
    const parsedPath = path.parse(fileFromPagesPath)

    let buildPath = path.join(info.configs.buildPath, parsedPath.dir)

    buildPath = createBuildPath(parsedPath, buildPath)

    const link = getLink(info.configs, buildPath)

    const pageData = {
      type: "raw",
      source: relativePath,
      content: raw,
      contents: contents,
      buildPath: buildPath,
      link: link,
      values: { stat },
      contents: contents
    }

    pagesArray.push(pageData)
  }

  return pagesArray
}

/**
 * Extend buildpath according to the name of the file
 *  - path/index.ext => path/index.html
 *  - path/something.ext => path/something/index.html
 *
 * @param {path.ParsedPath} parsedPath
 * @param {String} buildPath buildPath
 * @return {String} newBuildPath
 */
function createBuildPath(parsedPath, buildPath) {
  let newBuildPath
  if (parsedPath.name === "index") {
    newBuildPath = path.join(buildPath, "index.html")
  } else {
    newBuildPath = path.join(buildPath, parsedPath.name, "index.html")
  }
  return newBuildPath
}

/**
 * Get link from buildpath
 * @param {Object} configs
 * @param {String} buildPath
 * @return {String} link
 */
function getLink(configs, buildPath) {
  const link = path.relative(configs.buildPath, buildPath).slice(0, -10)

  this.link = url.format(link)

  if (!this.link.startsWith("/")) {
    this.link = "/" + this.link
  }

  return this.link
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
 * @param {String} info
 * @return {any}
 */
function $import(rPath, values, filePath, info) {
  const imgExts = [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".svg", ".webp"]
  let file = path.join(path.parse(filePath).dir, rPath)

  if (!path.isAbsolute(file)) {
    file = path.join(info.cwd, file)
  }

  const ext = path.parse(file).ext
  if (ext === ".ulka") {
    const raw = fs.readFileSync(file, "utf-8")
    return renderUlka(raw, values, file, info)
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
  if (filePath.startsWith(info.cwd)) {
    filePath = path.relative(info.cwd, filePath)
  }

  const relPath = path.join(path.parse(filePath).dir, rPath)

  const salt = relPath.split(path.sep).join("")
  const p = path.join("__assets__", generateHash(salt)) + path.parse(rPath).ext

  return "/" + url.format(p)
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

const renderUlkaCache = {}
/**
 * @param {String} raw Raw ulka
 * @param {Object} context Context
 * @param {String} filePath filepath
 * @param {Object} info
 * @return {String}
 */
function renderUlka(raw, context, filePath, info) {
  // while in development mode return cache if exists
  if (info.task === "develop") {
    const cache = renderUlkaCache[filePath]
    if (cache && cache.raw === raw && JSON.stringify(context) === raw.context) {
      return cache.html
    }
  }

  context = {
    ...context,
    $assets: rPath => $assets(rPath, filePath, info),
    $import: (rPath, $values = {}) => {
      return $import(rPath, { ...context, ...$values }, filePath, info)
    }
  }

  const html = render(raw, context, { base: filePath })

  renderUlkaCache[filePath] = { html, raw, context: JSON.stringify(context) }

  return html
}

/**
 * Generate html from content
 * @param {Object} contentData content data
 * @param {Object} contents contents
 * @param {Object} info info
 */
async function contentToHtml(contentData, contents, info) {
  try {
    const beforeContentRenderPlugin = info.configs.plugins.beforeContentRender
    const afterContentRenderPlugin = info.configs.plugins.afterContentRender

    // BeforeContentRender Plugins
    for (const plugin of beforeContentRenderPlugin) {
      await plugin({ contentData, contents, info })
    }

    if (contentData.type === "raw") {
      const html = renderMarkdown(contentData.content, info)
      const base = contentData.source || info.cwd

      contentData.html = renderUlka(html, { ...contentData, info }, base, info)
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

    log.success(contentData.link + "index.html")
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

/**
 * Generate html from page
 * @param {Object} pageData data of page
 * @param {Object} pages all pages
 * @param {Object} contents all contents
 * @param {Object} info Info about the program
 */
async function pageToHtml(pageData, pages, contents, info) {
  try {
    const beforePageRenderPlugins = info.configs.plugins.beforePageRender
    const afterPageRenderPlugins = info.configs.plugins.afterPageRender

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

/**
 * @param {String} cwd cwd
 * @param {String} task current rask
 * @return {Object} info
 */
function createInfo(cwd, task) {
  try {
    return {
      configs: getConfigs(cwd),
      cwd,
      task
    }
  } catch (e) {
    log.error(e.message, true)
    process.exit(0)
  }
}

module.exports = {
  createContentsMap,
  createPagesArray,
  contentToHtml,
  pageToHtml,
  createInfo
}
