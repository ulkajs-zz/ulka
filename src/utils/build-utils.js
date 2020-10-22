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
    const files = allFiles(content.path, info.contentsExtensions || ".md")

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

      const link = getLink(info, buildPath)

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
  const files = allFiles(
    info.configs.pagesPath,
    info.pagesExtensions || ".ulka"
  )

  const pagesArray = []
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8")
    const stat = fs.statSync(file)

    const relativePath = path.relative(info.cwd, file)

    const fileFromPagesPath = path.relative(info.configs.pagesPath, file)
    const parsedPath = path.parse(fileFromPagesPath)

    let buildPath = path.join(info.configs.buildPath, parsedPath.dir)

    buildPath = createBuildPath(parsedPath, buildPath)

    const link = getLink(info, buildPath)

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
 * @param {Object} info
 * @param {String} buildPath
 * @return {String} link
 */
function getLink(info, buildPath) {
  let link = path.relative(info.configs.buildPath, buildPath).slice(0, -10)

  const forMattedlink = url.format(link)

  link = info.prefix + forMattedlink

  if (!link.startsWith("/")) {
    link = "/" + link
  }

  return link
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
  const PREFIX_PATH = info.prefix + "__assets__"

  if (filePath.startsWith(info.cwd)) {
    filePath = path.relative(info.cwd, filePath)
  }

  const relPath = path.join(path.parse(filePath).dir, rPath)

  const salt = relPath.split(path.sep).join("")
  const p = path.join(PREFIX_PATH, generateHash(salt)) + path.parse(rPath).ext

  let link = url.format(p)

  if (!link.startsWith("/")) {
    link = "/" + link
  }

  return link
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
      let context = { ...contentData, info }
      const filePath = contentData.source || info.cwd

      const ext = path.parse(filePath).ext
      const extRenderer = info.renderer[ext]

      if (ext === "" || ext === ".md" || typeof extRenderer !== "function") {
        const html = renderMarkdown(contentData.content, info)
        contentData.html = renderUlka(html, context, filePath, info)
      } else {
        context = createContext(context, filePath, info)
        contentData.html = extRenderer(contentData.content, context, filePath)
      }
    } else {
      contentData.html = contentData.content
    }

    // AfterContentRender Plugins
    for (const plugin of afterContentRenderPlugin) {
      await plugin({ contentData, contents, info })
    }

    let context = { ...contentData, contents, info, data: contentData.html }
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

    const ext = path.parse(contentData.templatePath || "").ext

    const useUlka =
      ext === "" || ext === ".ulka" || typeof info.renderer[ext] !== "function"

    let html = ""
    if (useUlka) {
      html = renderUlka(
        contentData.template,
        context,
        contentData.templatePath || filePath,
        info
      )
    } else {
      context = createContext(
        context,
        contentData.templatePath || filePath,
        info
      )
      html = info.renderer[ext](
        contentData.template,
        context,
        contentData.templatePath || filePath
      )
    }

    const parsedBuildPath = path.parse(contentData.buildPath)

    if (parsedBuildPath.dir === path.join(info.configs.buildPath, "404")) {
      contentData.buildPath = path.join(info.configs.buildPath, "404.html")
    } else {
      mkdir(parsedBuildPath.dir)
    }

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
      let context = { ...pageData, contents, pages, info }
      const filePath = pageData.source || info.cwd

      const ext = path.parse(filePath).ext

      const extRenderer = info.renderer[ext]

      if (ext === "" || ext === ".ulka" || typeof extRenderer !== "function") {
        pageData.html = renderUlka(pageData.content, context, filePath, info)
      } else {
        context = createContext(context, filePath, info)
        pageData.html = extRenderer(pageData.content, context, filePath)
      }
    } else {
      pageData.html = pageData.content
    }

    // AfterPageRender Plugins
    for (const plugin of afterPageRenderPlugins) {
      await plugin({ pageData, pages, contents, info })
    }

    const parsedBuildPath = path.parse(pageData.buildPath)

    if (parsedBuildPath.dir === path.join(info.configs.buildPath, "404")) {
      pageData.buildPath = path.join(info.configs.buildPath, "404.html")
    } else {
      mkdir(parsedBuildPath.dir)
    }

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
    const configs = getConfigs(cwd)

    let prefix = configs.prefixUrl || "/"

    if (!prefix.endsWith("/")) {
      prefix += "/"
    }

    const pagesExtensions = [".ulka"]
    const contentsExtensions = [".md"]

    return {
      configs,
      cwd,
      task,
      pagesExtensions,
      contentsExtensions,
      ignoreExtensions: [".ulka", ".md"],
      renderer: {},
      prefix
    }
  } catch (e) {
    log.error(e.message, true)
    process.exit(0)
  }
}

/**
 * All values to contet
 * @param {Object} context
 * @param {String} filePath
 * @param {Object} info
 * @return {Object} context
 */
function createContext(context, filePath, info) {
  context = {
    ...context,
    $assets: rPath => $assets(rPath, filePath, info),
    $import: (rPath, $values = {}) => {
      return $import(rPath, { ...context, ...$values }, filePath, info)
    }
  }

  return context
}

module.exports = {
  createContentsMap,
  createPagesArray,
  contentToHtml,
  pageToHtml,
  createInfo,
  createBuildPath,
  getLink
}
