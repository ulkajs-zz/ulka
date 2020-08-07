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

const parseMd = async (markdown, filePath) => {
  const data = frontmatter(markdown)
  const toHtml = parseMarkdown(markdownImageRender(data.body))
  return {
    frontMatter: data.attributes,
    html: (await parseUlka(toHtml.trim(), globalInfo, filePath)).html
  }
}

function parseMarkdown(markdown) {
  if (!configs.contents) return markdown

  const beforeParse = configs.contents.preParse || []
  const afterParse = configs.contents.postParse || []

  beforeParse.forEach(plugins => {
    markdown = plugins(markdown)
  })

  let toHtml = md.render(markdown)

  afterParse.forEach(plugins => {
    toHtml = plugins(toHtml)
  })

  return toHtml
}

module.exports = parseMd
