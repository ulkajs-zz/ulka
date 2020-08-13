const frontmatter = require('front-matter')

const parseUlka = require('./parseUlka')
const globalInfo = require('../globalInfo')
const { beforeMdParse, afterMdParse, remarkPlugins } = require('./parsePlugins')
const parseMarkdownWithPlugins = require('../utils/parseMdWithPlugins')

const markdownImageRender = markdown => {
  return markdown.replace(/!\[(.*?)\]\((.*?)\)/, (...args) => {
    return `<img src="{% $assets('${args[2]}') %}" alt="${args[1]}" />`
  })
}

const parseMd = async (markdown, filePath = process.cwd()) => {
  const data = frontmatter(markdown)

  markdown = markdownImageRender(data.body)

  const { toHtml, prasedFrontMatter } = await parseMarkdownWithPlugins(
    markdown,
    data.attributes,
    { beforeMdParse, afterMdParse, remarkPlugins }
  )

  // Prase ulka if any ulka syntax
  const ulkaPrase = await parseUlka(toHtml.trim(), globalInfo, filePath)

  return {
    frontMatter: prasedFrontMatter,
    html: ulkaPrase.html
  }
}

module.exports = parseMd
