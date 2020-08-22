import path from "path"
import globalInfo from "../globalInfo"
import copyAssets from "../fs/copyAssets"
import generateFromMd from "../generate/generateMd"
import generateFromUlka from "../generate/generateUlka"

async function build(name = "*") {
  globalInfo.contentFiles = []

  const buildPath = globalInfo.configs.buildPath
  if (globalInfo.status === "serving") {
    globalInfo.configs.buildPath = ".debug"
  } else {
    globalInfo.configs.buildPath = buildPath
  }

  try {
    console.log(">> Copying assets".green)
    if (name === "*" || name === "copy")
      await copyAssets(
        path.join(process.cwd(), "src"),
        globalInfo.configs.buildPath
      )

    if (name === "*" || name === "md") {
      console.log(">> Generating from markdown files".green)

      const contentsIsArray = Array.isArray(globalInfo.configs.contents)
      if (contentsIsArray) {
        for (let i = 0; i < globalInfo.configs.contents.length; i++) {
          const contentsDir = globalInfo.configs.contents[i]
          await generateFromMd(contentsDir, i)
        }
      } else {
        await generateFromMd(globalInfo.configs.contents)
      }
    }

    if (name === "*" || name === "ulka") {
      console.log(">> Generating from ulka files".green)
      await generateFromUlka()
    }
  } catch (e) {
    console.log(`>> ${e.toString()}\n`.red)

    console.log(">> Build Failed".red)
    process.exit(0)
  }
}

export default build
