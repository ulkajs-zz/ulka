const frontmatter = require('front-matter')

const parseUlka = require('./parseUlka')
const globalInfo = require('../globalInfo')
const parseMarkdownWithPlugins = require('../utils/md-parser-util')

const markdownImageRender = markdown => {
  return markdown.replace(/!\[(.*?)\]\((.*?)\)/, (...args) => {
    return `<img src="{% $assets('${args[2]}') %}" alt="${args[1]}" />`
  })
}

const parseMd = async (markdown, filePath = process.cwd()) => {
  const data = frontmatter(markdown)

  // parseMarkdown and markdown's image tag
  const { toHtml, prasedFrontMatter } = await parseMarkdownWithPlugins(
    markdownImageRender(data.body),
    data.attributes
  )

  // Prase ulka if any ulka syntax
  const ulkaPrase = await parseUlka(toHtml.trim(), globalInfo, filePath)

  return {
    frontMatter: prasedFrontMatter,
    html: ulkaPrase.html
  }
}

module.exports = parseMd
