import unified from "unified"
import remarkParse from "remark-parse"
import remark2rehype from "remark-rehype"
import stringify from "rehype-stringify"

import globalInfo from "../globalInfo"

const processor = unified()
  .use(remarkParse, { commonmark: true })
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(stringify, { allowDangerousHtml: true, allowDangerousCharacters: true })

async function parseMarkdownWithPlugins(
  markdown: string,
  frontMatter: any,
  {
    beforeMdParse,
    afterMdParse,
    remarkPlugins
  }: { beforeMdParse: any; afterMdParse: any; remarkPlugins: any }
) {
  if (!globalInfo.configs.contents)
    return {
      toHtml: markdown,
      prasedFrontMatter: frontMatter
    }

  for (let i = 0; i < remarkPlugins.length; i++) {
    const { plugin, options } = remarkPlugins[i]()
    processor.use(plugin, options)
  }

  // Use before markdown parse plugins
  for (let i = 0; i < beforeMdParse.length; i++) {
    const plugin = beforeMdParse[i]
    const parsedMd = await plugin(markdown, frontMatter)

    markdown = parsedMd.markdown || markdown
    frontMatter = parsedMd.frontMatter || frontMatter
  }

  // Parse markdown to html
  const node = await processor.process(markdown)
  let toHtml = String(node)

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

export default parseMarkdownWithPlugins
