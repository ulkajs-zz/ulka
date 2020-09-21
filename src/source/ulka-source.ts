import path from "path"
import { writeFileSync } from "fs"
import { parse } from "ulka-parser"

import { mkdir } from "../fs"
import globalInfo from "../globalInfo"
import Source, { SourceContext } from "."
import $assets from "../utils/ulka-source-utils/$assets"
import config from "../data/configs"
import $import from "../utils/ulka-source-utils/$import"
import absolutePath from "../utils/absolute-path"

class UlkaSource extends Source {
  constructor(context: SourceContext) {
    super(context)
  }

  get values() {
    let val = this.context.values || {}
    val = {
      ...val,
      $assets: (rPath: string) => $assets(rPath, this.context.fPath),
      $import: (rPath: string, impValues = {}) => {
        return $import(rPath, { ...val, ...impValues }, this.context.fPath)
      },
      globalInfo
    }

    return val
  }

  /**
   * Use `before` plugins
   * Transform ulka to html
   * Use `after` plugins
   */
  async transform(): Promise<string> {
    const plugins = this.plugins
    let ulkaTemplate = await this.data

    if (!plugins.before) plugins.before = []
    if (!plugins.after) plugins.after = []

    for (let i = 0; i < plugins.before.length; i++) {
      const plugin = plugins.before[i]
      const d = await plugin(ulkaTemplate, this.values)

      if (d) {
        if (typeof d === "string") ulkaTemplate = d
        else if (d.ulkaTemplate) ulkaTemplate = d.ulkaTemplate
      }
    }

    const html = await parse(ulkaTemplate, this.values, {
      base: path.parse(this.context.fPath).dir,
      logError: false
    })

    this.context.html = html

    for (let i = 0; i < plugins.after.length; i++) {
      const plugin = plugins.after[i]
      const d = await plugin(this.context.html, this.values)

      if (d) {
        if (typeof d === "string") this.context.html = d
        else if (d.ulkaTemplate || d.html) {
          this.context.html = d.ulkaTemplate || d.html
        }
      }
    }

    return this.context.html
  }

  /**
   * Calculate buildPath from this.context.fPath with reference to pages path
   */
  calculate(fromPath = config.pagesPath) {
    const pathFromPages = path.relative(
      absolutePath(`src/${fromPath}`),
      this.context.fPath
    )

    const parsedFilePath = path.parse(pathFromPages)
    let buildpath = absolutePath(`${config.buildPath}/${parsedFilePath.dir}`)

    if (parsedFilePath.name !== "index") {
      buildpath = path.join(buildpath, parsedFilePath.name, "index.html")
    } else {
      buildpath = path.join(buildpath, "index.html")
    }

    this.context.buildPath = buildpath

    return buildpath
  }

  /**
   * Get html from this.transform
   * Get build path from this.calculate()
   *
   * Generate html file
   */
  async generate() {
    const html = await this.transform()
    const buildPath = this.calculate()

    await mkdir(path.parse(buildPath).dir)
    writeFileSync(buildPath, html)
  }

  static async transform(context: SourceContext) {
    const ulkaSourceInstance = new UlkaSource(context)
    return await ulkaSourceInstance.transform()
  }
}

export default UlkaSource
