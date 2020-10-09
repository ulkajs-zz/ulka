const path = require("path")

const { allFiles } = require("../utils/ulka-fs")
const { changeExtension } = require("../utils/helpers")
const { renderMarkdown, renderUlka } = require("../utils/render-utils")
const fs = require("fs")

/**
 * Generate Map of ulka files inside pagesPath
 *
 * @param {String} pagesPath
 * @param {Object} values
 * @return {Object}
 */
function generatePagesMap(pagesPath, values) {
  const allUlkaFilesInPages = allFiles(pagesPath, ".ulka")

  const pagesMap = {}

  for (const page of allUlkaFilesInPages) {
    const relativePathFromPagesPath = path.relative(pagesPath, page)

    const stat = fs.statSync(page)
    const htmlPath = changeExtension(relativePathFromPagesPath, ".html")

    const html = renderUlka(page, { ...values, stat, path: htmlPath })

    pagesMap[relativePathFromPagesPath] = {
      pagePath: relativePathFromPagesPath,
      contentType: "html",
      path: htmlPath,
      content: html,
      name: "pages",
      stat
    }
  }

  return pagesMap
}

/**
 * Generate map of md files inside contents.path
 *
 * @param {Object} contents
 * @param {Object} values
 * @return {any}
 */
function generateContentMap(contents, values) {
  const allMarkdownFilesInContents = allFiles(contents.path, ".md")

  const contentsMap = {}

  for (const content of allMarkdownFilesInContents) {
    const relativePathFromContentsPath = path.relative(contents.path, content)

    const htmlPath = changeExtension(relativePathFromContentsPath, ".html")

    const stat = fs.statSync(content)

    const { html, frontMatter, fields } = renderMarkdown(content, {
      ...values,
      path: htmlPath
    })

    contentsMap[relativePathFromContentsPath] = {
      contentPath: relativePathFromContentsPath,
      path: htmlPath,
      contentType: "html",
      content: html,
      values: { frontMatter, fields },
      name: contents.name,
      stat
    }
  }

  return contentsMap
}

module.exports = {
  generatePagesMap,
  generateContentMap
}
