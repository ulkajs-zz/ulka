const fs = require("fs")
const url = require("url")
const path = require("path")
const fm = require("front-matter")
const { allFiles } = require("./ulka-fs")

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

  return link
}

module.exports = {
  createContentsMap,
  createPagesArray
}
