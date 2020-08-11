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
  const data = frontmatter(markdown)

  // parseMarkdown and markdown's image tag
  const { toHtml, prasedFrontMatter } = parseMarkdown(
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

function parseMarkdown(markdown, frontMatter) {
  if (!configs.contents) return markdown

  const beforeParse = configs.contents.preParse || []
  const afterParse = configs.contents.postParse || []
  const parseFrontMatter = configs.contents.parseFrontMatter || []

  beforeParse.forEach(fnc => {
    markdown = fnc(markdown)
  })

  let toHtml = md.render(markdown)

  afterParse.forEach(fnc => {
    toHtml = fnc(toHtml)
  })

  parseFrontMatter.map(fnc => {
    frontMatter = fnc(frontMatter)
  })

  return {
    toHtml,
    prasedFrontMatter: frontMatter
  }
}

module.exports = parseMd
