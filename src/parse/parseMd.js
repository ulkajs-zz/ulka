const frontmatter = require('front-matter')
const { Remarkable } = require('remarkable')

const configs = require('./parseConfig')
const parseUlka = require('./parseUlka')
const globalInfo = require('..')

const md = new Remarkable({
  html: true
})

const markdownImageRender = markdown => {
  return markdown.replace(/!\[(.*?)\]\((.*?)\)/, (...args) => {
    return `<img src="{% $assets('${args[2]}') %}" alt="${args[1]}" />`
  })
}

const parseMd = async (markdown, filePath = process.cwd()) => {
  // Parse fontmatter
  const data = frontmatter(markdown)

  // parseMarkdown and markdown's image tag
  const toHtml = parseMarkdown(markdownImageRender(data.body))

  // Prase ulka if any ulka syntax
  const ulkaPrase = await parseUlka(toHtml.trim(), globalInfo, filePath)
  return {
    frontMatter: data.attributes,
    html: ulkaPrase.html
  }
}

function parseMarkdown(markdown) {
  if (!configs.contents) return markdown

  const beforeParse = configs.contents.preParse || []
  const afterParse = configs.contents.postParse || []

  beforeParse.forEach(fnc => {
    markdown = fnc(markdown)
  })

  let toHtml = md.render(markdown)

  afterParse.forEach(fnc => {
    toHtml = fnc(toHtml)
  })

  return toHtml
}

module.exports = parseMd
