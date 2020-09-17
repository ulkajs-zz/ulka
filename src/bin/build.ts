import path from "path"

import generate from "../generate"
import { copyAssets } from "../fs"
import globalInfo from "../globalInfo"
import configs from "../utils/data-utils/configs"

async function build() {
  globalInfo.contentFiles = []

  try {
    console.log(">> Copying assets".green)
    await copyAssets(path.join(process.cwd(), "src"), configs.buildPath)

    console.log(">> Generating pages\n".green)
    await generate()
  } catch (e) {
    console.log(`>> ${e.toString()}\n`.red)
    console.log(">> Build Failed :(".red)
  }
}

export default build
