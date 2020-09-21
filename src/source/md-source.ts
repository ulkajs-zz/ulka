import url from "url"
import path from "path"
import matter from "gray-matter"
import { writeFileSync } from "fs"

import { mkdir } from "../fs"
import UlkaSource from "./ulka-source"
import Source, { SourceContext } from "."
import config from "../data/configs"
import processor from "../utils/unified-processor"
import absolutePath from "../utils/absolute-path"
import { afterUlkaParse, beforeUlkaParse } from "../data/plugins"

class MDSource extends Source {
  constructor(context: SourceContext) {
    super(context)
  }

  async transform() {
    const plugins = this.plugins

    if (!plugins.before) plugins.before = []
    if (!plugins.after) plugins.after = []

    const markdown = await this.data
    const { content, data } = matter(markdown)

    this.context.frontMatter = data
    this.context.markdown = content
    this.context.fields = {}

    for (let i = 0; i < plugins.before.length; i++) {
      const plugin = plugins.before[i]

      const pluginContext = {
        markdown: this.context.markdown,
        frontMatter: this.context.frontMatter,
        fields: this.context.fields
      }

      await plugin(pluginContext)

      /**
       * Changing the whole markdown is a bad idea, one can use remark plugin for this
       * But keeping here, in case anyone needs it (NOT RECOMMENDED AT ALL).
       */
      this.context.markdown = pluginContext.markdown
    }

    const node = await processor().process(this.context.markdown)
    this.context.html = String(node)

    for (let i = 0; i < plugins.after.length; i++) {
      const plugin = plugins.after[i]

      const pluginContext = {
        html: this.context.html,
        frontMatter: this.context.frontMatter,
        fields: this.context.fields
      }

      await plugin(pluginContext)

      /**
       * Changing the whole html is a bad idea, one can use rehype plugin for this
       * But keeping here, in case anyone needs it (NOT RECOMMENDED AT ALL).
       */
      this.context.html = pluginContext.html
    }

    return {
      html: this.context.html,
      frontMatter: this.context.frontMatter,
      fields: this.context.fields,
      markdown: this.context.markdown
    }
  }

  calculate() {
    const {
      generatePath: genPath,
      path: contentsPath,
      template: tmpPath
    } = this.context.contentInfo

    const pathFromContents = path.relative(
      absolutePath(`src/${contentsPath}`),
      this.context.fPath
    )
    const { name, dir } = path.parse(pathFromContents)
    let buildFilePath = absolutePath(`${config.buildPath}/${genPath}/${dir}`)

    if (name !== "index") {
      buildFilePath = path.join(buildFilePath, name, "index.html")
    } else {
      buildFilePath = path.join(buildFilePath, "index.html")
    }

    const link =
      "/" +
      url
        .format(path.relative(absolutePath(config.buildPath), buildFilePath))
        .slice(0, -10)

    this.context.link = link
    this.context.buildFilePath = buildFilePath
    this.context.tmpPath = tmpPath

    return { tmpPath, link: link, buildFilePath }
  }

  async generate(datas: any) {
    let html = this.context.html
    let link = this.context.link
    let tmpPath = this.context.tmpPath
    let buildFilePath = this.context.buildFilePath

    let fields = this.context.fields
    let frontMatter = this.context.frontMatter
    let markdown = this.context.markdown

    if (!html || !frontMatter || !fields || !markdown) {
      const data = await this.transform()
      html = data.html
      frontMatter = data.frontMatter
      fields = data.fields
      markdown = data.markdown
    }

    if (!link || !buildFilePath || !tmpPath) {
      const data = this.calculate()
      link = data.link
      buildFilePath = data.buildFilePath
      tmpPath = data.tmpPath
    }

    const tHtml = await UlkaSource.transform({
      fPath: tmpPath,
      plugins: {
        before: beforeUlkaParse,
        after: afterUlkaParse
      },
      values: {
        contentData: datas,
        data: html,
        frontMatter,
        fields,
        markdown,
        link,
        buildFilePath,
        fPath: this.context.fPath
      }
    })

    await mkdir(path.parse(buildFilePath).dir)
    writeFileSync(buildFilePath, tHtml)
  }

  static async transform(context: SourceContext) {
    const mdSourceInstance = new MDSource(context)

    return await mdSourceInstance.transform()
  }
}

export default MDSource
