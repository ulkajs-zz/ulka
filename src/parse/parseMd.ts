import matter from "gray-matter"

import parseUlka from "./parseUlka"
import globalInfo from "../globalInfo"

import { beforeMdParse, afterMdParse, remarkPlugins } from "./parsePlugins"
import parseMarkdownWithPlugins from "../utils/parseMdWithPlugins"

const markdownImageRender = (markdown: string) => {
  return markdown.replace(/!\[(.*?)\]\((.*?)\)/, (...args) => {
    return `<img src="{% $assets('${args[2]}') %}" alt="${args[1]}" />`
  })
}

const parseMd = async (markdown: string, filePath = process.cwd()) => {
  const data = matter(markdown)

  markdown = markdownImageRender(data.content)

  const { toHtml, prasedFrontMatter } = await parseMarkdownWithPlugins(
    markdown,
    data.data,
    { beforeMdParse, afterMdParse, remarkPlugins }
  )

  // Prase ulka if any ulka syntax
  const ulkaPrase = await parseUlka(
    toHtml.trim(),
    { globalInfo, prasedFrontMatter },
    filePath
  )

  return {
    frontMatter: prasedFrontMatter,
    html: ulkaPrase.html
  }
}

export default parseMd
