import unified from "unified"
import remarkParse from "remark-parse"
import stringify from "rehype-stringify"
import remark2rehype from "remark-rehype"
import visit from "unist-util-visit"
import $assets from "./ulka-source-utils/$assets"

import * as plugins from "../data/plugins"

const { remarkPlugins: rmp, rehypePlugins: rhp } = plugins

function relativeImagePlugin(filePath: string) {
  return (tree: any) => {
    visit(tree, { type: "image" }, (node: any) => {
      node.url = String($assets(node.url, filePath))
    })
  }
}

export default function processor(filePath: string) {
  const processor = unified().use(remarkParse, { commonmark: true })

  processor.use(() => relativeImagePlugin(filePath))

  for (let i = 0; i < rmp.length; i++) {
    const plugin = rmp[i]
    const { plugin: rmPlugin, options } = plugin(processor)
    if (rmPlugin) processor.use(rmPlugin, options)
  }

  processor
    .use(remark2rehype, { allowDangerousHtml: true, commonmark: true })
    .use(stringify, {
      allowDangerousHtml: true,
      allowDangerousCharacters: true,
      allowParseErrors: true
    })

  for (let i = 0; i < rhp.length; i++) {
    const plugin = rhp[i]
    const { plugin: rhPlugin, options } = plugin(processor)
    if (rhPlugin) processor.use(rhPlugin, options)
  }

  return processor
}
