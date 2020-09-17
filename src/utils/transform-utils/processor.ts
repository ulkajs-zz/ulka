import unified from "unified"
import remarkParse from "remark-parse"
import stringify from "rehype-stringify"
import remark2rehype from "remark-rehype"

import * as plugins from "../data-utils/plugins"

const { remarkPlugins: rmp, rehypePlugins: rhp } = plugins

export default function processor() {
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
