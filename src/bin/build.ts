import path from "path"

import { copyAssets } from "../fs"
import generate from "../generate"
import globalInfo from "../globalInfo"
import { beforeBuild, afterBuild } from "../data/plugins"

const { configs } = globalInfo

async function build() {
  try {
    for (let i = 0; i < beforeBuild.length; i++) {
      const plugin = beforeBuild[i]
      plugin(globalInfo)
    }

    console.log(">> Copying assets".green)
    await copyAssets(path.join(process.cwd(), "src"), configs.buildPath)
    console.log(">> Generating pages\n".green)
    await generate()

    for (let i = 0; i < afterBuild.length; i++) {
      const plugin = afterBuild[i]
      plugin(globalInfo)
    }
  } catch (e) {
    console.log(`>> ${e.toString()}\n`.red)
    console.log(">> Build Failed :(".red)
  }
}

export default build
