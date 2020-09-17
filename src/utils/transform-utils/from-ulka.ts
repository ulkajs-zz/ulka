import path from "path"
import { parse } from "ulka-parser"

import $assets from "../ulka-utils/$assets"
import $import from "../ulka-utils/$import"
import * as plugins from "../data-utils/plugins"
import dataFromPath from "../path-utils/data-from-path"

const { beforeUlkaParse: bup, afterUlkaParse: aup } = plugins

export default async function fromUlka(
  fPath: string,
  values: any,
  data?: string
) {
  if (!data) {
    data = dataFromPath(fPath).data
  }

  values = {
    ...values,
    $assets: (rPath: string) => $assets(rPath, fPath),
    $import: (rPath: string) => $import(rPath, values, fPath)
  }

  // Before ulka parse
  for (let i = 0; i < bup.length; i++) {
    const plugin = bup[i]
    const d: { ulkaTemplate: string; values: any } = await plugin(data, values)

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
    const d: string | { ulkaTemplate: string } = await plugin(data, values)

    if (d) {
      if (typeof d === "string") data = d
      else if (d.ulkaTemplate) data = d.ulkaTemplate
    }
  }

  return data
}
