import path from "path"
import { parse } from "ulka-parser"

import { plugins } from "../utils/data-utils"
import { absolutePath, dataFromPath } from "../utils/path-utils"

const { beforeUlkaParse: bup, afterUlkaParse: aup } = plugins

function generate(fileName: string) {
  return fileName
}

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

export function fromMd(fPath: string) {
  fPath = absolutePath(fPath)

  return fPath
}
export default generate
