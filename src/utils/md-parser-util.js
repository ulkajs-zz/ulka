const { Remarkable } = require('remarkable')

const globalInfo = require('../globalInfo')
const {
  beforeMdParse,
  afterMdParse,
  frontMatterParse
} = require('../parse/parsePlugins')

const md = new Remarkable({
  html: true
})

async function parseMarkdownWithPlugins(markdown, frontMatter) {
  if (!globalInfo.configs.contents) return markdown

  for (let i = 0; i < beforeMdParse.length; i++) {
    const plugin = beforeMdParse[i]
    markdown = await plugin(markdown)
  }

  let toHtml = md.render(markdown)

  for (let i = 0; i < afterMdParse.length; i++) {
    const plugin = afterMdParse[i]
    toHtml = await plugin(toHtml)
  }

  for (let i = 0; i < frontMatterParse.length; i++) {
    const plugin = frontMatterParse[i]
    frontMatter = plugin(frontMatter)
  }

  return {
    toHtml,
    prasedFrontMatter: frontMatter
  }
}

module.exports = parseMarkdownWithPlugins
