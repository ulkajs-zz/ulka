const frontmatter = require('front-matter')
const { Remarkable } = require('remarkable')

const configs = require('./parseConfig')
const parseUlka = require('./parseUlka')

const md = new Remarkable({
  html: true
})

const markdownImageRender = markdown => {
  return markdown.replace(/!\[(.*?)\]\((.*?)\)/, (...args) => {
    return `<img src="{% $assets('${args[2]}') %}" alt="${args[1]}" />`
  })
}

const parseMd = markdown => {
  const data = frontmatter(markdown)
  const toHtml = parseMarkdown(markdownImageRender(markdown))
  return {
    frontMatter: data.attributes,
    html: parseUlka(toHtml.trim()).html
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
