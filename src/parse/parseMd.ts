import frontmatter from 'front-matter'

import parseUlka from './parseUlka'
import globalInfo from '../globalInfo'

import { beforeMdParse, afterMdParse, remarkPlugins } from './parsePlugins'
import parseMarkdownWithPlugins from '../utils/parseMdWithPlugins'

const markdownImageRender = (markdown: string) => {
  return markdown.replace(/!\[(.*?)\]\((.*?)\)/, (...args) => {
    return `<img src="{% $assets('${args[2]}') %}" alt="${args[1]}" />`
  })
}

const parseMd = async (markdown: string, filePath = process.cwd()) => {
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

export default parseMd
