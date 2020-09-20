import path from "path"
import { writeFileSync } from "fs"
import { parse } from "ulka-parser"

import { mkdir } from "../fs"
import Source, { SourceContext } from "."
import config from "../utils/data-utils/configs"
import $import from "../utils/ulka-utils/$import"
import $assets from "../utils/ulka-utils/$assets"
import absolutePath from "../utils/path-utils/absolute-path"

interface UlkaContext extends SourceContext {
  values: {
    [key: string]: any
  }
}

class Ulka extends Source {
  constructor(public context: UlkaContext) {
    super(context)
  }

  get values() {
    let val = this.context.values || {}
    val = {
      ...val,
      $assets: (rPath: string) => $assets(rPath, this.context.fPath),
      $import: (rPath: string, impValues = {}) => {
        return $import(rPath, { ...val, ...impValues }, this.context.fPath)
      }
    }

    return val
  }

  async transform() {
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

    const html = await parse(ulkaTemplate, this.values)
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

  async generate() {
    const html = await this.transform()

    const pathFromPages = path.relative(
      absolutePath(`src/${config.pagesPath}`),
      this.context.fPath
    )

    const parsedFilePath = path.parse(pathFromPages)
    let buildpath = absolutePath(`${config.buildPath}/${parsedFilePath.dir}`)

    if (parsedFilePath.name !== "index") {
      buildpath = path.join(buildpath, parsedFilePath.name, "index.html")
    } else {
      buildpath = path.join(buildpath, "index.html")
    }

    await mkdir(buildpath)

    writeFileSync(buildpath, html)
  }
}

export default Ulka
