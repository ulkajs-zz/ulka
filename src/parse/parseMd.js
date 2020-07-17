const frontmatter = require('front-matter')
const { Remarkable } = require('remarkable')
const configs = require('./parseConfig')

const md = new Remarkable({
  html: true
})

const parseMd = markdown => {
  const data = frontmatter(markdown)
  const toHtml = parseMarkdown(markdown)
  return {
    frontMatter: data.attributes,
    html: toHtml.trim()
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
