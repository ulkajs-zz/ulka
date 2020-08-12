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

  // Use frontmatter parse plugins
  for (let i = 0; i < frontMatterParse.length; i++) {
    const plugin = frontMatterParse[i]
    frontMatter = (await plugin(frontMatter)) || frontMatter
  }

  // Use before markdown parse plugins
  for (let i = 0; i < beforeMdParse.length; i++) {
    const plugin = beforeMdParse[i]
    markdown = (await plugin(markdown)) || markdown
  }

  // Parse markdown to html
  let toHtml = md.render(markdown)

  // Use after markdown parse plugins
  for (let i = 0; i < afterMdParse.length; i++) {
    const plugin = afterMdParse[i]
    toHtml = (await plugin(toHtml)) || toHtml
  }

  return {
    toHtml,
    prasedFrontMatter: frontMatter
  }
}

module.exports = parseMarkdownWithPlugins
