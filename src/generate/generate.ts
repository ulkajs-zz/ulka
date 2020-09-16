import path from "path"
import unified from "unified"
import matter from "gray-matter"
import { parse } from "ulka-parser"
import remarkParse from "remark-parse"
import stringify from "rehype-stringify"
import remark2rehype from "remark-rehype"

import { plugins } from "../utils/data-utils"
import { absolutePath, dataFromPath } from "../utils/path-utils"

const {
  beforeUlkaParse: bup,
  afterUlkaParse: aup,
  beforeMdParse: bmp,
  afterMdParse: amp,
  remarkPlugins: rmp,
  rehypePlugins: rhp
} = plugins

export async function fromUlka(fPath: string, values: any) {
  fPath = absolutePath(fPath)
  let { data } = dataFromPath(fPath)

  // Before ulka parse
  for (let i = 0; i < bup.length; i++) {
    const plugin = bup[i]
    const d = await plugin(data, values)

    if (d) {
      if (d.ulkaTemplate) data = d.ulkaTemplate
      if (d.values) values = d.values
    }
  }

  data = await parse(data, values, {
    base: path.parse(fPath).dir,
    logError: false
  })

  // After ulka parse
  for (let i = 0; i < aup.length; i++) {
    const plugin = aup[i]
    const d = await plugin(data, values)

    if (d) {
      if (typeof d === "string") data = d
      else if (d.ulkaTemplate) data = d.ulkaTemplate
    }
  }

  return data
}

export async function fromMd(fPath: string) {
  fPath = absolutePath(fPath)
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

  return fPath
}

export function processor() {
  const processor = unified().use(remarkParse, { commonmark: true })

  for (let i = 0; i < rmp.length; i++) {
    const plugin = rmp[i]
    const { plugin: rmPlugin, options } = plugin(processor)
    if (rmPlugin) processor.use(rmPlugin, options)
  }

  processor.use(remark2rehype, { allowDangerousHtml: true }).use(stringify, {
    allowDangerousHtml: true,
    allowDangerousCharacters: true
  })

  for (let i = 0; i < rhp.length; i++) {
    const plugin = rhp[i]
    const { plugin: rhPlugin, options } = plugin(processor)
    if (rhPlugin) processor.use(rhPlugin, options)
  }

  return processor
}
