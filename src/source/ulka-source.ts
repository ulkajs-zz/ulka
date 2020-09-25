import path from "path"
import { writeFileSync } from "fs"
import { compile } from "ulka-parser"

import { mkdir } from "../fs"
import globalInfo from "../globalInfo"
import Source, { SourceContext } from "."
import $assets from "../utils/ulka-source-utils/$assets"
import config from "../data/configs"
import $import from "../utils/ulka-source-utils/$import"
import absolutePath from "../utils/absolute-path"
import {
  afterUlkaParse,
  beforeUlkaParse,
  PluginAfterUlka,
  PluginBeforeUlka
} from "../data/plugins"

export interface UlkaSourceContext extends SourceContext {
  values?: object
  plugins?: {
    before: PluginBeforeUlka[]
    after: PluginAfterUlka[]
  }
}

class UlkaSource extends Source<UlkaSourceContext> {
  constructor(context: UlkaSourceContext) {
    super(context)
    this.context.plugins = {
      before: beforeUlkaParse,
      after: afterUlkaParse
    }
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
    const plugins = this.context.plugins!
    let ulkaTemplate = await this.data

    if (!plugins.before) plugins.before = []
    if (!plugins.after) plugins.after = []

    for (let i = 0; i < plugins.before.length; i++) {
      const plugin = plugins.before[i]

      const pluginContext = {
        ulkaTemplate,
        values: this.values
      }

      await plugin(pluginContext)

      ulkaTemplate = pluginContext.ulkaTemplate
    }

    const html = await compile(ulkaTemplate, this.values, {
      base: path.parse(this.context.fPath).dir,
      logError: false
    })

    this.context.html = html

    for (let i = 0; i < plugins.after.length; i++) {
      const plugin = plugins.after[i]

      const pluginContext = {
        html: this.context.html,
        values: this.values
      }

      await plugin(pluginContext)

      this.context.html = pluginContext.html
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

  static async transform(context: UlkaSourceContext) {
    const ulkaSourceInstance = new UlkaSource(context)
    return await ulkaSourceInstance.transform()
  }
}

export default UlkaSource
