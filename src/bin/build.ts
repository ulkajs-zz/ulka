import path from "path"

import globalInfo from "../globalInfo"
import { copyAssets } from "../fs"
import generate from "../generate"

async function build(name = "*") {
  globalInfo.contentFiles = []

  const buildPath = globalInfo.configs.buildPath

  if (globalInfo.status === "serving") globalInfo.configs.buildPath = ".debug"
  else globalInfo.configs.buildPath = buildPath

  try {
    console.log(">> Copying assets".green)
    if (name === "*" || name === "copy")
      await copyAssets(
        path.join(process.cwd(), "src"),
        globalInfo.configs.buildPath
      )

    console.log(">> Generating pages\n".green)
    await generate()
  } catch (e) {
    console.log(`>> ${e.toString()}\n`.red)
    console.log(">> Build Failed :(".red)
  }
}

export default build
