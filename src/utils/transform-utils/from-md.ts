import matter from "gray-matter"

import { processor } from "."
import { plugins } from "../data-utils"
import { dataFromPath } from "../path-utils"

const { beforeMdParse: bmp, afterMdParse: amp } = plugins

export default async function fromMd(fPath: string) {
  const { data } = dataFromPath(fPath)

  let { content: markdown, data: frontMatter } = matter(data)

  for (let i = 0; i < bmp.length; i++) {
    const plugin = bmp[i]
    const d = await plugin(markdown, frontMatter)
    if (d) {
      if (d.markdown) markdown = d.markdown
      if (d.frontMatter) frontMatter = { ...frontMatter, ...d.frontMatter }
    }
  }

  const node = processor().process(markdown)

  let html = String(node)

  for (let i = 0; i < amp.length; i++) {
    const plugin = amp[i]
    const d = await plugin(html, frontMatter)
    if (d) {
      if (d.html) html = d.html
      if (d.frontMatter) frontMatter = { ...frontMatter, ...d.frontMatter }
    }
  }

  return { html, frontMatter }
}
