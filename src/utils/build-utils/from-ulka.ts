import path from "path"
import { parse } from "ulka-parser"

import { plugins } from "../data-utils"
import { dataFromPath } from "../path-utils"

const { beforeUlkaParse: bup, afterUlkaParse: aup } = plugins

export default async function fromUlka(fPath: string, values: any) {
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
