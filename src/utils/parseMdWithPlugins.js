const { Remarkable } = require('remarkable')

const globalInfo = require('../globalInfo')

const md = new Remarkable({
  html: true
})

async function parseMarkdownWithPlugins(
  markdown,
  frontMatter,
  { beforeMdParse, afterMdParse }
) {
  if (!globalInfo.configs.contents) return markdown

  // Use before markdown parse plugins
  for (let i = 0; i < beforeMdParse.length; i++) {
    const plugin = beforeMdParse[i]
    const parsedMd = await plugin(markdown, frontMatter)

    markdown = parsedMd.markdown || markdown
    frontMatter = parsedMd.frontMatter || frontMatter
  }

  // Parse markdown to html
  let toHtml = md.render(markdown)

  // Use after markdown parse plugins
  for (let i = 0; i < afterMdParse.length; i++) {
    const plugin = afterMdParse[i]
    const parsedHtml = await plugin(toHtml, frontMatter)
    frontMatter = parsedHtml.frontMatter || frontMatter
    toHtml = parsedHtml.toHtml || toHtml
    frontMatter = parsedHtml.frontMatter || frontMatter
  }

  return {
    toHtml,
    prasedFrontMatter: frontMatter
  }
}

module.exports = parseMarkdownWithPlugins
