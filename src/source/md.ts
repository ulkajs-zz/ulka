import url from "url"
import path from "path"
import matter from "gray-matter"
import { writeFileSync } from "fs"

import { mkdir } from "../fs"
import UlkaSource from "./ulka"
import Source, { SourceContext } from "."
import config from "../utils/data-utils/configs"
import processor from "../utils/transform-utils/processor"
import absolutePath from "../utils/path-utils/absolute-path"
import { afterUlkaParse, beforeUlkaParse } from "../utils/data-utils/plugins"

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

    for (let i = 0; i < plugins.before.length; i++) {
      const plugin = plugins.before[i]

      const pluginContext = {
        markdown: this.context.markdown,
        frontMatter: this.context.frontMatter
      }

      await plugin(pluginContext)
    }

    const node = await processor().process(this.context.markdown)
    this.context.html = String(node)

    for (let i = 0; i < plugins.after.length; i++) {
      const plugin = plugins.after[i]

      const pluginContext = {
        html: this.context.html,
        frontMatter: this.context.frontMatter
      }

      await plugin(pluginContext)
    }

    return {
      html: this.context.html,
      frontMatter: this.context.frontMatter
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
      url.format(path.relative(absolutePath(config.buildPath), buildFilePath))

    this.context.link = link
    this.context.buildFilePath = buildFilePath
    this.context.tmpPath = tmpPath

    return { tmpPath, link: link, buildFilePath }
  }

  async generate(datas: any, index?: number) {
    let html = this.context.html
    let frontMatter = this.context.frontMatter
    let link = this.context.link
    let buildFilePath = this.context.buildFilePath
    let tmpPath = this.context.tmpPath

    if (!html || !frontMatter) {
      const data = await this.transform()
      html = data.html
      frontMatter = data.frontMatter
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
        index
      }
    })

    await mkdir(path.parse(buildFilePath).dir)
    writeFileSync(buildFilePath, tHtml)
  }
}

export default MDSource
